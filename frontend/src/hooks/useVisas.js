import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PAGE_SIZE = 10;

export default function useVisas(initialParams = {}) {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [params, setParams] = useState({ page: 1, search: '', status: 'all', ...initialParams });

  const fetchVisas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/visas', {
        params: { ...params, limit: PAGE_SIZE },
      });
      setVisas(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setVisas([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchVisas();
  }, [fetchVisas]);

  const updateParams = (updates) => setParams((p) => ({ ...p, ...updates }));

  return { visas, loading, total, totalPages, params, updateParams, refetch: fetchVisas };
}
