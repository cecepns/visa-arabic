import { FileX } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = 'Try adjusting your search or filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileX className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}
