import { useState } from 'react';
import { Link } from 'react-router';
import type { ModalType } from '../components/Canvas';
import Canvas from '../components/Canvas';
import { EASTER_SWATCHES } from '../constants/canvas';
import { useAuth } from '../contexts/useAuth';
import { useTokenAuth } from '../hooks/useTokenAuth';
import api from '../lib/api';

export default function EasterEgg() {
  const { user } = useAuth();
  useTokenAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const saveEasterEgg = async (data: string | null) => {
    if (!data) {
      setActiveModal('save-error');
      return;
    }

    try {
      const response = await api.post('/save-easter-egg', { eggData: data });

      if (response.status === 200) {
        setActiveModal('save-success');
      }
    } catch {
      setActiveModal('save-error');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-6">
        <h1 className="uppercase text-red-primary dark:text-red-primary-light text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[2px]">
          Ozdób swoją pisankę!
        </h1>
        {user && (
          <h2
            className="font-black text-xl sm:text-2xl lg:text-[28px] tracking-[5px] mt-2"
            style={{
              color: '#4278ad',
              fontFamily: "'Playwrite NO', sans-serif"
            }}
          >
            {user.username}
          </h2>
        )}
      </div>

      <Canvas
        savePainting={(data) => saveEasterEgg(data)}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        shape="egg"
        swatches={EASTER_SWATCHES}
      />

      {activeModal !== null && activeModal !== 'clear-canvas' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="uppercase leading-none text-red-primary dark:text-red-primary-light text-[48px] font-black tracking-[2px] mb-4">
              {activeModal === 'save-success' && 'Zapisano pomyślnie!'}
              {activeModal === 'save-error' && 'Nie udało się zapisać.'}
              {activeModal === 'clear-file' && 'Wyczyścić płótno?'}
            </h2>

            {activeModal === 'save-success' && (
              <>
                <p className="mb-4">Pisanka została zapisana pomyślnie!</p>
                <div className="flex justify-between mt-6">
                  <Link to="/">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Strona główna
                    </button>
                  </Link>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Zamknij
                  </button>
                </div>
              </>
            )}

            {activeModal === 'save-error' && (
              <p>Niestety nie udało się zapisać pisanki, proszę spróbować ponownie później.</p>
            )}

            {activeModal === 'clear-file' && (
              <>
                <p className="mb-4">Jesteś pewien, że chcesz wyczyścić całą pisankę?</p>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Wyczyść
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
