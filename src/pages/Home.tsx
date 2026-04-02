import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { colorScheme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="flex flex-col items-center gap-4">
        <h1 className="uppercase text-red-primary dark:text-red-primary-light text-[62px] font-black tracking-[2px]">
          Gorasul
        </h1>
        <img
          src={`/gorasul-${colorScheme}.png`}
          alt="Gorasul Logo"
          className="w-75 h-auto rounded-md bg-red-primary dark:bg-red-primary-light"
        />
        <div className="text-center mt-5">
          <span className="text-sm tracking-widest text-red-primary dark:text-red-primary-light">
            Serwer
          </span>
          <h2 className="text-xl  tracking-wider text-red-primary dark:text-red-primary-light">
            HECTOR EU
          </h2>
        </div>
      </div>
    </div>
  );
}
