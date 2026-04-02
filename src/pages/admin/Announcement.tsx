import { IconAlertCircle, IconBrandDiscord, IconCircleCheck, IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import api from '../../lib/api';

const MAX_LENGTH = 2000;

export default function Announcement() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const remaining = MAX_LENGTH - message.length;
  const isValid = message.trim().length > 0 && remaining >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || sending) return;

    setSending(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      await api.post('/discord/send-announcement', { message: message.trim() });
      setStatus('success');
      setMessage('');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        setErrorMsg('Brak uprawnień do wysyłania ogłoszeń.');
      } else {
        setErrorMsg('Nie udało się wysłać ogłoszenia. Spróbuj ponownie.');
      }
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-[80vh] py-10">
      <div className="max-w-2xl w-full mx-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden"
        >
          <div className="px-6 pt-7 pb-5 flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <IconBrandDiscord size={22} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                Ogłoszenie Discord
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Wiadomość zostanie wysłana na skonfigurowany kanał Discord serwera.
              </p>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-neutral-700" />

          <div className="px-6 py-6">
            <label className="block mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Treść ogłoszenia
              </span>
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                wymagane
              </span>
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                rows={8}
                maxLength={MAX_LENGTH}
                placeholder="Wpisz treść ogłoszenia..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm resize-none transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              <span
                className={`absolute bottom-3 right-3 text-xs tabular-nums transition-colors ${
                  remaining <= 100
                    ? remaining <= 0
                      ? 'text-red-500 dark:text-red-400 font-semibold'
                      : 'text-amber-500 dark:text-amber-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {remaining}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
              Limit Discorda: {MAX_LENGTH} znaków.
            </p>
          </div>

          {status === 'success' && (
            <div className="mx-6 mb-5 flex items-center gap-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              <IconCircleCheck size={18} className="shrink-0" />
              <span>Ogłoszenie zostało wysłane na kanał Discord.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mx-6 mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              <IconAlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <hr className="border-gray-200 dark:border-neutral-700" />

          <div className="px-6 py-4 flex items-center justify-end bg-gray-50 dark:bg-neutral-900/50">
            <button
              type="submit"
              disabled={!isValid || sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-primary hover:bg-red-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <IconSend size={16} />
              {sending ? 'Wysyłanie…' : 'Wyślij ogłoszenie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
