interface BrushOptionsProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
}

const sizeLabels = ['Bardzo mały', 'Mały', 'Średni', 'Duży', 'Bardzo duży', 'Ogromny'];

export default function BrushOptions({ brushSize, setBrushSize }: BrushOptionsProps) {
  const labelIndex = (brushSize - 5) / 10;

  return (
    <div className="flex flex-col gap-2">
      <input
        type="range"
        min={5}
        max={55}
        step={10}
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-primary dark:accent-red-primary-light bg-gray-200 dark:bg-neutral-700"
      />
      <div className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
        {sizeLabels[labelIndex]}
      </div>
    </div>
  );
}
