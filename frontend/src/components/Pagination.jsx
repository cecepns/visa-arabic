import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, total, showing, onPageChange }) {
  const safeTotalPages = totalPages || 1;

  return (
    <footer className="flex items-center justify-between mt-4 text-sm">
      <p className="text-gray-500">
        Showing {showing} of {total}
      </p>
      <span className="flex gap-2 items-center">
        <button
          type="button"
          disabled={page <= 1}
          className="icon-btn disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-3 py-1">
          Page {page} / {safeTotalPages}
        </span>
        <button
          type="button"
          disabled={page >= safeTotalPages}
          className="icon-btn disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </span>
    </footer>
  );
}
