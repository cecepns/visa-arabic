import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, size = 'default' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className={`${sizeClass} animate-spin text-ksa-purple`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className={`${sizeClass} animate-spin text-ksa-purple`} />
    </div>
  );
}
