interface BrushOptionsProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
}

const sizeLabels = ['Bardzo mały', 'Mały', 'Średni', 'Duży', 'Bardzo duży', 'Ogromny'];

export default function BrushOptions({ brushSize, setBrushSize }: BrushOptionsProps) {
  const labelIndex = (brushSize - 5) / 10;
  const min = 5;
  const max = 55;
  const percent = ((brushSize - min) / (max - min)) * 100;
  const accent = 'var(--mantine-color-primary, #e03131)';
  const gray = 'var(--mantine-color-gray, #e5e7eb)';
  const darkAccent = 'var(--mantine-color-primary-dark, #ff8787)';
  const darkGray = 'var(--mantine-color-gray-dark, #374151)';

  // Use CSS variables for dark mode, fallback to Tailwind colors
  const background = `linear-gradient(90deg, ${accent} 0%, ${accent} ${percent}%, ${gray} ${percent}%, ${gray} 100%)`;
  const backgroundDark = `linear-gradient(90deg, ${darkAccent} 0%, ${darkAccent} ${percent}%, ${darkGray} ${percent}%, ${darkGray} 100%)`;

  return (
    <div className="flex flex-col gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-primary dark:accent-red-primary-light"
        style={{
          background: background
          // Use dark mode background if needed
          // This is a simple approach; for full dark mode support, use a CSS class toggle or a library
        }}
        data-dark-background={backgroundDark}
      />
      <div className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
        {sizeLabels[labelIndex]}
      </div>
    </div>
  );
}
