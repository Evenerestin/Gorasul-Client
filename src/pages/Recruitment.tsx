import { IconChevronDown, IconHash, IconSend } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { CHARACTER_CLASSES } from '../constants/classes';
import { useTheme } from '../contexts/ThemeContext';
import api from '../lib/api';

const inputClass =
  'w-full h-11 px-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm transition-shadow focus:outline-none';

export default function Register() {
  const { colorScheme } = useTheme();
  const [form, setForm] = useState({
    discordNick: '',
    characterNick: '',
    characterClass: '',
    level: '',
    hasExperience: true,
    about: '',
    honeypot: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [classOpen, setClassOpen] = useState(false);
  const [classLang, setClassLang] = useState<'pl' | 'eng'>('pl');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const classRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (classRef.current && !classRef.current.contains(e.target as Node)) setClassOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(
    () => () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    },
    []
  );

  const isValid = form.discordNick.trim() && form.characterNick.trim() && captchaToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === 'submitting' || cooldownLeft > 0) return;
    if (form.honeypot) return;

    setStatus('submitting');
    try {
      await api.post('/register', {
        recaptchaToken: captchaToken,
        discordUsername: form.discordNick.trim(),
        characterName: form.characterNick.trim(),
        characterClass: form.characterClass,
        characterLevel: Number(form.level),
        hasExperience: form.hasExperience,
        aboutYourself: form.about.trim() || undefined
      });
      setStatus('submitted');
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err && err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      } else {
        console.error('No response from server or not an Axios error.');
      }
      setStatus('idle');
    } finally {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setCooldownLeft(30);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldownLeft((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current!);
            cooldownTimerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  if (status === 'submitted') {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="max-w-lg w-full mx-4 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <IconSend size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Zgłoszenie wysłane!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Twoje zgłoszenie trafiło na nasz kanał Discord. Odezwiemy się wkrótce!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="max-w-lg w-full">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden"
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 'auto',
              width: 1,
              height: 1,
              overflow: 'hidden'
            }}
          >
            <input
              type="text"
              name="website"
              value={form.honeypot}
              onChange={(e) => setField('honeypot', e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="px-6 pt-7 pb-5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Zgłoszenie do gildii
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Wypełnij formularz — aplikacja trafi prosto na nasz kanał Discord.
            </p>
          </div>

          <hr className="border-gray-200 dark:border-neutral-700" />

          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Discord
            </p>
            <label className="block mb-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Nick na Discordzie
              </span>
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                wymagane
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.discordNick}
                onChange={(e) => setField('discordNick', e.target.value)}
                placeholder="TwójNick#1234"
                className={`${inputClass} pr-10`}
              />
              <IconHash
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
              Jeśli założyłeś konto Discord przed 2023 rokiem, podaj pełny tag z #, abyśmy mogli Cię
              znaleźć i dodać.
            </p>
          </div>

          <hr className="border-gray-200 dark:border-neutral-700" />

          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Postać
            </p>

            <label className="block mb-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Nick postaci
              </span>
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                wymagane
              </span>
            </label>
            <input
              type="text"
              value={form.characterNick}
              onChange={(e) => setField('characterNick', e.target.value)}
              placeholder="NazwaPostaci"
              className={inputClass}
            />

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_5.5rem] gap-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Klasa postaci
                </label>
                <div ref={classRef} className="flex items-start gap-2">
                  <div className="flex h-11 shrink-0 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-1">
                    {(['pl', 'eng'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setClassLang(lang)}
                        className={`h-full rounded-lg px-2.5 text-xs font-semibold transition-all ${
                          classLang === lang
                            ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="relative min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setClassOpen((o) => !o)}
                      className={`${inputClass} flex items-center justify-between text-left ${
                        !form.characterClass ? 'text-gray-400 dark:text-gray-500' : ''
                      }`}
                    >
                      <span className="truncate">
                        {form.characterClass
                          ? (CHARACTER_CLASSES.find((c) => c.class.pl === form.characterClass)
                              ?.class[classLang] ?? form.characterClass)
                          : 'Wybierz klasę...'}
                      </span>
                      <IconChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform ${
                          classOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {classOpen && (
                      <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-xl py-1 max-h-52 overflow-y-auto form-scroll">
                        {CHARACTER_CLASSES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setField('characterClass', c.class.pl);
                              setClassOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                              form.characterClass === c.class.pl
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-primary dark:text-red-primary-light'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                          >
                            <span className="inline-flex items-center align-middle">
                              <img
                                src={`/classes/${c.id}.webp`}
                                alt={c.class[classLang]}
                                className="w-4 h-4 mr-2 object-contain"
                                style={{ verticalAlign: 'middle' }}
                              />
                              {c.class[classLang]}
                              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                                {c.race}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Level
                </label>
                <input
                  type="number"
                  value={form.level}
                  onChange={(e) => setField('level', e.target.value)}
                  placeholder="85"
                  min={1}
                  max={260}
                  className={`${inputClass} text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors ${
                    form.level && (Number(form.level) < 1 || Number(form.level) > 260)
                      ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400'
                      : ''
                  }`}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-neutral-700" />

          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Doświadczenie
            </p>

            <label className="flex items-center justify-between cursor-pointer group rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-3.5">
              <div className="pr-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-primary dark:group-hover:text-red-primary-light transition-colors">
                  Grałem/am już wcześniej w Rappelz
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Odznacz jeśli to Twój pierwszy raz — możemy pomóc z podstawami.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.hasExperience}
                onClick={() => setField('hasExperience', !form.hasExperience)}
                className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  form.hasExperience
                    ? 'bg-red-primary dark:bg-red-primary-light'
                    : 'bg-gray-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.hasExperience ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Kilka słów o sobie{' '}
                <span className="text-gray-400 dark:text-gray-500 font-normal">(opcjonalnie)</span>
              </label>
              <textarea
                value={form.about}
                onChange={(e) => setField('about', e.target.value)}
                placeholder="Skąd znasz grę, czego szukasz w gildii, kiedy grasz..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm resize-none transition-shadow focus:outline-none"
              />
              {form.about.length > 0 && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-right mt-1">
                  {form.about.length}/500
                </p>
              )}
            </div>
          </div>

          <div className="px-1 pb-4 flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={setCaptchaToken}
              onExpired={() => setCaptchaToken(null)}
              theme={colorScheme}
            />
          </div>

          <div className="px-6 pb-7 pt-2">
            <button
              type="submit"
              disabled={!isValid || status === 'submitting' || cooldownLeft > 0}
              className="w-full h-12 rounded-xl bg-red-primary dark:bg-red-primary-light text-white font-semibold text-sm shadow-md shadow-red-primary/20 dark:shadow-red-primary-light/20 hover:brightness-110 hover:shadow-lg hover:shadow-red-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-primary dark:focus-visible:ring-red-primary-light"
            >
              {status === 'submitting'
                ? 'Wysyłanie...'
                : cooldownLeft > 0
                  ? `Poczekaj ${cooldownLeft}s`
                  : 'Wyślij zgłoszenie →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
