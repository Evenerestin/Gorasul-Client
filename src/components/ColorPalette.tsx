import { useCallback, useEffect, useRef, useState } from 'react';

export const CHRISTMAS_SWATCHES = [
  'rgb(101,4,12)',
  'rgb(123,28,14)',
  'rgb(44,59,52)',
  'rgb(53,83,68)',
  'rgb(42,92,48)',
  'rgb(111,57,30)',
  'rgb(182,110,48)',
  'rgb(207,169,98)',
  'rgb(149,30,38)',
  'rgb(227, 77, 87)',
  'rgb(90,158,35)',
  'rgb(106,128,64)',
  'rgb(118,155,108)',
  'rgb(237,191,40)',
  'rgb(255, 234, 120)',
  'rgb(255, 248, 207)',
  'rgb(174,7,11)',
  'rgb(222,36,28)',
  'rgb(238,80,56)',
  'rgb(46,71,113)',
  'rgb(65,171,206)',
  'rgb(65,115,196)',
  'rgb(27,118,160)',
  'rgb(153,178,224)'
];

export const EASTER_SWATCHES = [
  'rgb(255, 182, 193)',
  'rgb(255, 160, 180)',
  'rgb(255, 105, 180)',
  'rgb(219, 112, 147)',
  'rgb(255, 218, 185)',
  'rgb(255, 228, 196)',
  'rgb(244, 164, 96)',
  'rgb(210, 180, 140)',
  'rgb(255, 255, 186)',
  'rgb(255, 234, 120)',
  'rgb(255, 215, 0)',
  'rgb(237, 191, 40)',
  'rgb(186, 255, 201)',
  'rgb(144, 238, 144)',
  'rgb(50, 205, 50)',
  'rgb(34, 139, 34)',
  'rgb(186, 225, 255)',
  'rgb(135, 206, 250)',
  'rgb(0, 191, 255)',
  'rgb(70, 130, 180)',
  'rgb(218, 186, 255)',
  'rgb(186, 148, 255)',
  'rgb(138, 43, 226)',
  'rgb(148, 103, 189)'
];

interface ColorPaletteProps {
  color: string;
  setColor: (color: string) => void;
  swatches?: string[];
}

export default function ColorPalette({
  color,
  setColor,
  swatches = CHRISTMAS_SWATCHES
}: ColorPaletteProps) {
  const [textValue, setTextValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const colorToHex = useCallback((cssColor: string): string => {
    if (/^#[0-9a-fA-F]{6}$/i.test(cssColor)) return cssColor.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/i.test(cssColor)) {
      return (
        '#' +
        cssColor[1] +
        cssColor[1] +
        cssColor[2] +
        cssColor[2] +
        cssColor[3] +
        cssColor[3]
      ).toLowerCase();
    }
    const el = document.createElement('div');
    el.style.color = cssColor;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    const match = computed.match(/\d+/g);
    if (!match || match.length < 3) return cssColor;
    return (
      '#' +
      match
        .slice(0, 3)
        .map((n) => parseInt(n).toString(16).padStart(2, '0'))
        .join('')
    );
  }, []);

  useEffect(() => {
    const hex = colorToHex(color);
    setTextValue(hex);
    setIsInvalid(false);
    setColorHistory((prev) => {
      if (prev[0] === hex) return prev;
      return [hex, ...prev.filter((c) => c !== hex)].slice(0, 5);
    });
  }, [color, colorToHex]);

  const parseColor = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const el = document.createElement('div');
    el.style.color = '';
    el.style.color = trimmed;
    if (!el.style.color) return null;

    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    return computed || null;
  };

  const applyTextColor = (value: string) => {
    const parsed = parseColor(value);
    if (parsed) {
      setColor(parsed);
      setIsInvalid(false);
    } else if (value.trim()) {
      setIsInvalid(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            onClick={() => {
              setColor(swatch);
            }}
            className="w-full aspect-square rounded-lg border-2 transition-all duration-150 hover:scale-110 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
              backgroundColor: swatch,
              borderColor:
                color === swatch ? (swatch.includes('255') ? '#333' : '#fff') : 'transparent',
              boxShadow: color === swatch ? '0 0 0 2px rgba(0,0,0,0.15)' : undefined
            }}
            title={swatch}
          />
        ))}
      </div>
      <div className="flex items-center rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 overflow-hidden">
        <button
          onClick={() => colorPickerRef.current?.click()}
          className="w-11 h-11 shrink-0 cursor-pointer hover:brightness-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset border-r border-gray-200 dark:border-neutral-700"
          style={{ backgroundColor: color }}
          title="Otwórz próbnik kolorów"
        />
        <input
          ref={colorPickerRef}
          type="color"
          value={color.startsWith('#') ? color : '#000000'}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="#hex, rgb(), hsl()..."
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
            setIsInvalid(false);
          }}
          onBlur={() => applyTextColor(textValue)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyTextColor(textValue);
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text');
            setTimeout(() => applyTextColor(pasted), 0);
          }}
          className={`flex-1 h-11 px-3 text-sm font-mono bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none ${
            isInvalid ? 'text-red-500 dark:text-red-400' : ''
          }`}
        />
        {colorHistory.length > 1 && (
          <div className="flex items-center gap-0.5 pr-2 border-l border-gray-200 dark:border-neutral-700 pl-2">
            {colorHistory.slice(1).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-6 h-6 rounded-md border border-gray-200 dark:border-neutral-600 hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
