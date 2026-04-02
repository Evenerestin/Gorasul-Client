import { Link } from 'react-router';
import Illustration from './Illustration';

export default function NotFoundBackground() {
  return (
    <div className="py-20 max-w-3xl mx-auto px-4">
      <div className="relative">
        <Illustration className="absolute inset-0 opacity-75 text-gray-100 dark:text-gray-800" />
        <div className="relative z-1 pt-55 sm:pt-30">
          <h1 className="text-center font-medium text-[38px] sm:text-[32px] font-[Outfit,sans-serif]">
            Nic tu nie ma
          </h1>
          <p className="text-gray-500 text-lg text-center max-w-135 mx-auto mt-5 mb-8">
            Strona, którą próbujesz otworzyć, nie istnieje. Być może wpisałeś błędny adres lub
            strona została przeniesiona pod inny adres URL.
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <button className="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-white/80">
                Powrót na stronę główną
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
