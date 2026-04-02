import { IconHammer } from '@tabler/icons-react';

export default function ComingSoon({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-primary/10 dark:bg-red-primary-light/10">
          <IconHammer size={32} className="text-red-primary dark:text-red-primary-light" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {label ?? 'Już wkrótce'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Ta strona jest jeszcze w przygotowaniu. Zajrzyj tu wkrótce!
        </p>
      </div>
    </div>
  );
}
