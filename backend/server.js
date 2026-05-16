require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads-visa-arabic';
const CORS_ORIGIN = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'ksa_visa_super_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Ensure upload directory exists
const uploadPath = path.join(__dirname, UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const MAX_PAGE_SIZE = 10;

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(query.limit, 10) || MAX_PAGE_SIZE));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'visa_system',
  waitForConnections: true,
  connectionLimit: 10,
});

// Middleware
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(uploadPath));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Helpers
const generateVisaNumber = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `SA-${new Date().getFullYear()}-${num}`;
};

const generateApplicationNumber = () => {
  const num = String(Math.floor(1 + Math.random() * 999999)).padStart(6, '0');
  return `APP-${new Date().getFullYear()}-${num}`;
};

const logAction = async (visaId, adminId, action, description) => {
  try {
    await pool.execute(
      'INSERT INTO visa_logs (visa_id, admin_id, action, description) VALUES (?, ?, ?, ?)',
      [visaId, adminId, action, description]
    );
  } catch (e) {
    console.error('Log error:', e.message);
  }
};

const getVisaQrPath = (visaId) => `/hajvisa/${visaId}`;

const mapVisa = (visa) => (visa ? { ...visa, qr_url: getVisaQrPath(visa.id) } : visa);

const generateQRForVisa = async (visaId) => {
  const qrPath = path.join(uploadPath, `qr-${visaId}.png`);
  await QRCode.toFile(qrPath, getVisaQrPath(visaId), {
    width: 300,
    margin: 2,
    color: { dark: '#1a237e' },
  });
  return `/uploads/qr-${visaId}.png`;
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: admin.id, email: admin.email, full_name: admin.full_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.json({
      token,
      admin: { id: admin.id, email: admin.email, full_name: admin.full_name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, full_name FROM admins WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Admin not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [totals] = await pool.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM visa_applicants
    `);

    const [statusStats] = await pool.execute(`
      SELECT status, COUNT(*) as count FROM visa_applicants GROUP BY status
    `);

    const [monthlyStats] = await pool.execute(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM visa_applicants
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({
      stats: totals[0],
      statusStats,
      monthlyStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== VISA APPLICANTS CRUD ====================

app.get('/api/visas', authenticateToken, async (req, res) => {
  try {
    const { search, status } = req.query;
    const { page, limit, offset } = parsePagination(req.query);
    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ` AND (full_name LIKE ? OR passport_number LIKE ? OR visa_number LIKE ? OR application_number LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status && status !== 'all') {
      where += ' AND status = ?';
      params.push(status);
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM visa_applicants ${where}`,
      params
    );

    const [rows] = await pool.execute(
      `SELECT * FROM visa_applicants ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const total = countResult[0].total;
    res.json({
      data: rows.map(mapVisa),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/visas/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ message: 'Visa not found' });
    res.json(mapVisa(rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/visas/inquiry', async (req, res) => {
  try {
    const { passport_number, visa_number, application_number } = req.body;

    if (application_number) {
      const [rows] = await pool.execute(
        passport_number
          ? 'SELECT * FROM visa_applicants WHERE application_number = ? AND passport_number = ?'
          : 'SELECT * FROM visa_applicants WHERE application_number = ?',
        passport_number ? [application_number, passport_number] : [application_number]
      );
      if (!rows.length) return res.status(404).json({ message: 'Visa not found' });
      return res.json(mapVisa(rows[0]));
    }

    if (!passport_number || !visa_number) {
      return res.status(400).json({ message: 'Passport number and visa number are required' });
    }
    const [rows] = await pool.execute(
      'SELECT * FROM visa_applicants WHERE passport_number = ? AND visa_number = ?',
      [passport_number, visa_number]
    );
    if (!rows.length) return res.status(404).json({ message: 'Visa not found' });
    res.json(mapVisa(rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/visas', authenticateToken, upload.single('profile_photo'), async (req, res) => {
  try {
    const {
      full_name,
      passport_number,
      nationality,
      visa_type,
      sponsor_name,
      issue_date,
      expiry_date,
      status,
    } = req.body;

    const visa_number = generateVisaNumber();
    const application_number = generateApplicationNumber();
    const profile_photo = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO visa_applicants
        (full_name, passport_number, nationality, visa_number, visa_type, sponsor_name,
         issue_date, expiry_date, status, profile_photo, application_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        passport_number,
        nationality,
        visa_number,
        visa_type || 'Tourist',
        sponsor_name || null,
        issue_date,
        expiry_date,
        status || 'pending',
        profile_photo,
        application_number,
      ]
    );

    const visaId = result.insertId;
    const qrPath = await generateQRForVisa(visaId);
    await pool.execute('UPDATE visa_applicants SET barcode_qr = ? WHERE id = ?', [
      qrPath,
      visaId,
    ]);

    await logAction(visaId, req.user.id, 'CREATE', `Created visa for ${full_name}`);

    const [newVisa] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [
      visaId,
    ]);
    res.status(201).json(mapVisa(newVisa[0]));
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Duplicate visa or passport number' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/visas/:id', authenticateToken, upload.single('profile_photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ message: 'Visa not found' });

    const {
      full_name,
      passport_number,
      nationality,
      visa_type,
      sponsor_name,
      issue_date,
      expiry_date,
      status,
    } = req.body;

    let profile_photo = existing[0].profile_photo;
    if (req.file) profile_photo = `/uploads/${req.file.filename}`;

    await pool.execute(
      `UPDATE visa_applicants SET
        full_name=?, passport_number=?, nationality=?, visa_type=?,
        sponsor_name=?, issue_date=?, expiry_date=?, status=?, profile_photo=?
       WHERE id=?`,
      [
        full_name,
        passport_number,
        nationality,
        visa_type,
        sponsor_name,
        issue_date,
        expiry_date,
        status,
        profile_photo,
        id,
      ]
    );

    await logAction(id, req.user.id, 'UPDATE', `Updated visa for ${full_name}`);
    const [updated] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [id]);
    res.json(mapVisa(updated[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/visas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ message: 'Visa not found' });

    await pool.execute('DELETE FROM visa_applicants WHERE id = ?', [id]);
    await logAction(id, req.user.id, 'DELETE', `Deleted visa for ${existing[0].full_name}`);

    // Clean up files
    const visa = existing[0];
    if (visa.profile_photo) {
      const photoPath = path.join(__dirname, visa.profile_photo.replace('/uploads/', UPLOAD_DIR + '/'));
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }
    const qrPath = path.join(uploadPath, `qr-${id}.png`);
    if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);

    res.json({ message: 'Visa deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Regenerate QR
app.post('/api/visas/:id/regenerate-qr', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ message: 'Visa not found' });

    const qrPath = await generateQRForVisa(id);
    await pool.execute('UPDATE visa_applicants SET barcode_qr = ? WHERE id = ?', [qrPath, id]);
    await logAction(id, req.user.id, 'QR_REGENERATE', 'Regenerated QR code');

    const [updated] = await pool.execute('SELECT * FROM visa_applicants WHERE id = ?', [id]);
    res.json(mapVisa(updated[0]));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== LOGS ====================

app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);

    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM visa_logs');
    const [rows] = await pool.execute(
      `
      SELECT vl.*, va.full_name, a.full_name as admin_name
      FROM visa_logs vl
      LEFT JOIN visa_applicants va ON vl.visa_id = va.id
      LEFT JOIN admins a ON vl.admin_id = a.id
      ORDER BY vl.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    const total = countResult[0].total;
    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SETTINGS ====================

app.put('/api/settings/password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM admins WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(current_password, rows[0].password);
    if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });
    const hash = await bcrypt.hash(new_password, 10);
    await pool.execute('UPDATE admins SET password = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SEED ADMIN (dev helper) ====================

app.post('/api/seed-admin', async (req, res) => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.execute(
      `INSERT INTO admins (email, password, full_name) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE password = ?`,
      ['admin@ksa.com', hash, 'System Administrator', hash]
    );
    res.json({ message: 'Admin seeded: admin@ksa.com / admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`KSA Visa API running on http://localhost:${PORT}`);
});
