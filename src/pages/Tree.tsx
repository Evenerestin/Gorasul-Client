import { IconZoomIn } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Ornament {
  id: number;
  username: string;
  ornamentData: string;
  position: {
    top: string;
    left: string;
  };
  color?: string;
}

const BADGE_COLORS: Record<string, string> = {
  red: 'bg-red-500',
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  yellow: 'bg-yellow-500'
};

export default function Tree() {
  const [opened, setOpened] = useState(false);
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);

  const getOrnamentColor = (id: number): string => {
    const colors = ['red', 'green', 'blue', 'yellow'];
    return colors[id % 4];
  };

  const getOrnamentBorderColor = (id: number): string => {
    const darkColors = ['#e03131', '#2f9e44', '#1971c2', '#f59f00'];
    return darkColors[id % 4];
  };

  useEffect(() => {
    const fetchOrnamentData = async () => {
      try {
        const response = await api.get('/get-ornaments');
        if (Array.isArray(response.data)) {
          setOrnaments(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching ornament data:', error);
      }
    };

    fetchOrnamentData();
  }, []);

  const renderOrnaments = (size: 'sm' | 'lg') =>
    ornaments.map((ornament, index) => {
      if (!ornament.ornamentData) return null;
      const imgSize = size === 'sm' ? '40px' : '70px';
      return (
        <div
          key={index}
          className="absolute flex flex-col items-center justify-center gap-1"
          style={{
            top: `${ornament.position?.top}%`,
            left: `${ornament.position?.left}%`
          }}
        >
          <span
            className={`text-[10px] text-white px-1.5 py-0.5 rounded-full ${BADGE_COLORS[getOrnamentColor(ornament.id)]}`}
          >
            {ornament.username}
          </span>
          <img
            src={ornament.ornamentData}
            alt={`Bombka ${ornament.username}`}
            className="rounded-full object-cover bg-gray-200 dark:bg-neutral-800"
            style={{
              width: imgSize,
              height: imgSize,
              border: `3px solid ${getOrnamentBorderColor(ornament.id)}`
            }}
          />
        </div>
      );
    });

  return (
    <div>
      <div className="absolute top-0 left-0 w-auto h-screen overflow-hidden">
        <video
          src="/snow.mov"
          autoPlay
          loop
          muted
          className="fixed top-0 left-0 w-screen h-screen object-cover"
        />
      </div>
      <div className="relative z-1 flex flex-col items-center gap-6 h-screen justify-center">
        <h1
          className="font-black text-[32px] tracking-[5px]"
          style={{ color: '#4278ad', fontFamily: "'Playwrite NO', sans-serif" }}
        >
          Gorasuloinka
        </h1>
        <button
          onClick={() => setOpened(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
        >
          <IconZoomIn size={18} />
          Powiększ
        </button>
        <div className="relative inline-block">
          <img
            src="/treebase.png"
            alt="Gorasuloinka"
            className="rounded-md max-h-[80vh] w-auto max-w-[90vw]"
          />
          {renderOrnaments('sm')}
        </div>
      </div>

      {opened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpened(false)}
        >
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpened(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <div className="relative inline-block w-full">
              <img
                src="/treebase.png"
                alt="Gorasuloinka - powiększona"
                className="rounded-md w-full h-auto"
              />
              {renderOrnaments('lg')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
