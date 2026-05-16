import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PAGE_SIZE = 10;

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/logs', { params: { page, limit: PAGE_SIZE } });
      setLogs(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setLogs([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    total,
    totalPages,
    page,
    setPage,
    refetch: fetchLogs,
  };
}
