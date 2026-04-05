import { useCallback, useEffect, useRef, useState } from 'react';

interface ColorPaletteProps {
  color: string;
  setColor: (color: string) => void;
  colorHistory: string[];
  setColorHistory: React.Dispatch<React.SetStateAction<string[]>>;
  swatches?: string[];
}

export default function ColorPalette({
  color,
  setColor,
  colorHistory,
  setColorHistory,
  swatches
}: ColorPaletteProps) {
  const [textValue, setTextValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
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
      return [hex, ...prev.filter((c) => c !== hex)].slice(0, 7);
    });
  }, [color, colorToHex, setColorHistory]);

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
        {swatches?.map((swatch) => (
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
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex items-center w-full gap-2">
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 flex items-center overflow-hidden">
            <div className="rounded-lg border m-1 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
              <button
                onClick={() => colorPickerRef.current?.click()}
                className="w-10 h-10 shrink-0 cursor-pointer hover:brightness-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
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
            </div>
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
              className={`h-6 px-3 m-1 me-2 text-sm rounded-md font-mono bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none ${
                isInvalid ? 'text-red-500 dark:text-red-400' : ''
              }`}
              style={{ minWidth: 120 }}
            />
          </div>
        </div>
        {colorHistory.length > 1 && (
          <div className="flex items-center gap-0.5 pl-2 pr-2">
            {colorHistory.slice(1).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-10 h-10 rounded-md border border-gray-200 dark:border-neutral-600 hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
