import { QRCodeSVG } from 'qrcode.react';
import { getImageUrl, getVisaQrUrl } from '../../utils/helpers';
import {
  formatVisaDate,
  getNationalityBilingual,
  getVisaTypeBilingual,
  getDurationLabel,
  digitsOnly,
  generateBarcodeWidths,
  generateMRZ,
} from '../../utils/visaDocument';
import { VISA_PAGE_WIDTH_PX, VISA_PAGE_MIN_HEIGHT_PX } from '../../utils/visaLayout';

function CheckDivider() {
  return (
    <div className="flex justify-center flex-wrap gap-0.5 py-3 select-none" aria-hidden>
      {Array.from({ length: 48 }).map((_, i) => (
        <span key={i} className="text-[#7B5EA7] text-[10px] leading-none font-bold">
          ✓
        </span>
      ))}
    </div>
  );
}

function BarcodeBlock({ value, labelEn, labelAr }) {
  const code = digitsOnly(value) || value || '0000000000';
  const bars = generateBarcodeWidths(code);

  return (
    <div className="flex-1 text-center px-2">
      <p className="text-[11px] text-gray-700 mb-2 font-arabic" dir="rtl">
        <span className="font-semibold">{labelAr}</span>
        <span className="mx-1 text-gray-400">/</span>
        <span>{labelEn}</span>
      </p>
      <div className="flex items-end justify-center gap-[1px] h-14 mx-auto max-w-[240px]">
        {bars.map((w, i) => (
          <span key={i} className="bg-black inline-block" style={{ width: `${w}px`, height: i % 5 === 0 ? '85%' : '100%' }} />
        ))}
      </div>
      <p className="font-mono text-sm mt-2 tracking-[0.2em] text-gray-900">{code}</p>
    </div>
  );
}

function TopFieldRow({ labelEn, labelAr, value }) {
  return (
    <div className="grid grid-cols-[1fr_minmax(140px,1.2fr)_1fr] items-center border-b border-gray-400 py-2 text-[13px]">
      <span className="font-arabic text-right text-gray-800 pr-2" dir="rtl">
        {labelAr}
      </span>
      <span className="text-center font-semibold text-gray-900 px-2">{value}</span>
      <span className="text-left text-gray-800 pl-2">{labelEn}</span>
    </div>
  );
}

function DetailRow({ labelEn, labelAr, value }) {
  return (
    <div className="grid grid-cols-[1fr_minmax(160px,1.4fr)_1fr] items-center border-b border-gray-300 py-2.5 text-[13px]">
      <span className="font-arabic text-right text-gray-800 pr-3" dir="rtl">
        {labelAr}
      </span>
      <span className="text-center font-medium text-gray-900 px-3">{value}</span>
      <span className="text-left text-gray-800 pl-3">{labelEn}</span>
    </div>
  );
}

export default function VisaTemplate({ visa }) {
  if (!visa) return null;

  const photoUrl = getImageUrl(visa.profile_photo);
  const qrUrl = getVisaQrUrl(visa);
  const mrzLines = generateMRZ(visa);
  const DEFAULT_PLACE_OF_ISSUE = 'Saudi Digital Embassy - السفارة السعودية الرقمية';
  const placeOfIssue = visa.place_of_issue || DEFAULT_PLACE_OF_ISSUE;
  const serviceProvider = visa.sponsor_name || 'Ministry of Foreign Affairs - وزارة الخارجية';
  const borderNo = visa.border_no || String(visa.id || 0);
  const localService =
    visa.local_service ||
    digitsOnly(visa.application_number).slice(-12) ||
    digitsOnly(visa.visa_number);

  return (
    <div
      id="visa-print-area"
      className="visa-document relative bg-white text-gray-900 mx-auto shadow-2xl"
      style={{
        width: VISA_PAGE_WIDTH_PX,
        minHeight: VISA_PAGE_MIN_HEIGHT_PX,
        fontFamily: "'Cairo', 'Noto Sans Arabic', 'Arial', sans-serif",
      }}
    >
      {/* Watermark emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="opacity-[0.06] select-none text-center">
          <div className="text-[140px] leading-none">🇸🇦</div>
          <p className="font-arabic text-4xl font-bold mt-2 text-gray-800" dir="rtl">
            المملكة العربية السعودية
          </p>
        </div>
      </div>

      <div className="relative px-6 py-5">
        {/* Header logos */}
        <header className="flex items-start justify-between mb-5 pb-4 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#4a148c]">KSA</span>
                <span className="text-2xl font-black tracking-tight text-[#1a237e]">VISA</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[#00897b]">e</span>
                <span className="text-lg font-bold text-[#1a237e]">VISA</span>
              </div>
              <p className="text-[9px] text-gray-500 font-arabic max-w-[140px]" dir="rtl">
                تأشيرة المملكة العربية السعودية الإلكترونية
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-1">🇸🇦</div>
            <p className="text-[10px] font-bold tracking-wide text-gray-800">KINGDOM OF SAUDI ARABIA</p>
            <p className="text-[11px] font-arabic font-bold text-gray-800" dir="rtl">
              المملكة العربية السعودية
            </p>
          </div>
        </header>

        {/* Photo + top fields */}
        <section className="flex gap-5 mb-2">
          <div className="flex-shrink-0 w-[130px] h-[165px] border-2 border-gray-500 bg-gray-50 overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2 font-arabic">
                صورة شخصية
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <TopFieldRow labelEn="Visa No." labelAr="رقم التأشيرة" value={visa.visa_number} />
            <TopFieldRow labelEn="Valid from" labelAr="صالحة من" value={formatVisaDate(visa.issue_date)} />
            <TopFieldRow labelEn="Valid until" labelAr="صالحة حتى" value={formatVisaDate(visa.expiry_date)} />
            <TopFieldRow labelEn="Duration of Stay" labelAr="مدة الإقامة" value={getDurationLabel(visa)} />
            <TopFieldRow labelEn="Passport No." labelAr="رقم الجواز" value={visa.passport_number} />
          </div>
        </section>

        <CheckDivider />

        {/* Place of issue */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3 text-[13px] mb-1">
          <span className="font-arabic text-right text-gray-800" dir="rtl">
            مكان الإصدار
          </span>
          <span className="text-center font-semibold px-4 text-gray-900">
            {placeOfIssue}
          </span>
          <span className="text-left text-gray-800">Place of issue</span>
        </div>

        {/* Detail rows */}
        <section className="border-t border-gray-400 mt-2">
          <DetailRow labelEn="Name" labelAr="الاسم" value={visa.full_name?.toUpperCase()} />
          <DetailRow labelEn="Nationality" labelAr="الجنسية" value={getNationalityBilingual(visa.nationality)} />
          <DetailRow labelEn="Type Of Visa" labelAr="نوع التأشيرة" value={getVisaTypeBilingual(visa.visa_type)} />
          <DetailRow labelEn="Service Provider" labelAr="شركة تقديم الخدمات" value={serviceProvider} />
          <DetailRow labelEn="Border No" labelAr="رقم الحدود" value={borderNo} />
          <DetailRow labelEn="Local Service" labelAr="الخدمة الميدانية" value={localService} />
        </section>

        {/* Barcodes */}
        <section className="flex gap-4 mt-8 mb-6 px-2">
          <BarcodeBlock value={visa.visa_number} labelEn="Visa No." labelAr="رقم التأشيرة" />
          <BarcodeBlock value={visa.application_number} labelEn="Application No." labelAr="رقم الطلب" />
        </section>

        <CheckDivider />

        {/* QR footer */}
        <footer className="flex items-center justify-center gap-8 py-6">
          <p className="text-[11px] text-gray-700 max-w-[120px] text-right leading-snug">
            For Visa Inquiry
            <br />
            Please scan QR code
          </p>
          <div className="flex-shrink-0 p-2 border border-gray-300 bg-white">
            <QRCodeSVG value={qrUrl} size={100} level="H" />
          </div>
          <p className="text-[11px] text-gray-700 max-w-[120px] text-left leading-snug font-arabic" dir="rtl">
            للإستعلام عن التأشيرة
            <br />
            يرجى مسح رمز الاستجابة السريعة
          </p>
        </footer>

        {/* MRZ */}
        <div className="bg-gray-100 border border-gray-300 px-3 py-3 mt-2 font-mono text-[11px] leading-relaxed tracking-wider text-gray-900 break-all">
          {mrzLines.map((line) => (
            <p key={line} className="whitespace-pre overflow-hidden">
              {line}
            </p>
          ))}
        </div>

        {/* Page meta */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200 text-[9px] text-gray-500">
          <span>https://visa.mofa.gov.sa/Home/PrintVisa</span>
          <span>
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })},{' '}
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} — Page 1 of 1
          </span>
        </div>
      </div>
    </div>
  );
}
