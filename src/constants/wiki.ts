export interface WikiEntry {
  slug: string;
  title: string;
  content: string;
}

export interface WikiCategory {
  slug: string;
  label: string;
  description: string;
  entries: WikiEntry[];
}

export const wikiCategories: WikiCategory[] = [
  {
    slug: 'postacie',
    label: 'Postacie',
    description: 'Informacje o klasach postaci dostępnych w grze.',
    entries: [
      {
        slug: 'wojownik',
        title: 'Wojownik',
        content:
          'Wojownik to czołowa klasa walki wręcz, specjalizująca się w zadawaniu i absorpcji obrażeń na pierwszej linii frontu. Wyróżnia się najwyższym baseowym HP spośród wszystkich klas oraz dostępem do ciężkich pancerzy i tarcz.\n\nDzięki umiejętnościom takim jak Uderzenie Ogłuszające czy Szarża, Wojownik doskonale sprawdza się w roli tanka w grupach rajdowych, blokując ataki bossów i utrzymując ich uwagę. Może też grać ofensywnie, poświęcając nieco wytrzymałości na rzecz obrażeń przez specjalizację Barbarzyńca.\n\nRekomendowane statystyki: Siła (STR) jako główna, Wytrzymałość (VIT) jako uzupełnienie. Na wyższych poziomach warto zainwestować w Obronę Magiczną, szczególnie podczas walk z bossami używającymi zaklęć obszarowych.'
      },
      {
        slug: 'strzelec',
        title: 'Strzelec',
        content:
          'Strzelec to klasa zasięgowa zadająca wysokie obrażenia fizyczne z bezpiecznej odległości. Posługuje się łukami i kuszami, a jego największą zaletą jest możliwość atakowania wrogów zanim ci dotrą na odległość ciosu.\n\nKlasa ta słynie z umiejętności Grad Strzał — obszarowego ataku idealnego do czyszczenia grup potworów — oraz Precyzyjnego Strzału zadającego ogromne obrażenia pojedynczemu celowi. Ze względu na niską obronę Strzelec wymaga odpowiedniego pozycjonowania i unikania walki wręcz.\n\nRekomendowane statystyki: Zręczność (DEX) jako priorytet, uzupełniona o Szczęście (LUK) dla zwiększenia szansy na trafienia krytyczne. Do władania najsilniejszymi łukami wymagany jest minimalny poziom Siły (STR).'
      },
      {
        slug: 'mag',
        title: 'Mag',
        content:
          'Mag jest mistrzem niszczycielskiej magii żywiołów — ognia, lodu i błyskawic. Potrafi eliminować całe grupy wrogów jednym zaklęciem obszarowym, ale płaci za to bardzo niską wytrzymałością i praktycznym brakiem obrony fizycznej.\n\nNajważniejsze umiejętności to Meteoryt (ogromne obrażenia jednemu celowi), Blizzard (spowalnianie i obrażenia w obszarze) oraz Łańcuch Błyskawic (przeskakujący między wrogami). Mag korzysta na wysokim Poziomie Inteligencji, który bezpośrednio skaluje obrażenia zaklęć.\n\nRekomendowane statystyki: Inteligencja (INT) jako główna w 100%, nie inwestuj w Siłę ani Zręczność. Używaj Różdżek lub Kosturów dla premii do siły magicznej. Na wyższych etapach gry warto zaopatrzyć się w przedmioty skracające czas odnowienia (cooldown).'
      },
      {
        slug: 'kaplan',
        title: 'Kapłan',
        content:
          'Kapłan to podstawowy uzdrowiciel i wzmacniacz w każdej drużynie. Jego zestawy leczące i buffy sprawiają, że jest niezbędny podczas trudniejszych rajdów i walk z bossami. W odpowiednich rękach Kapłan może utrzymać przy życiu całą drużynę nawet w najbardziej wymagających starciach.\n\nKluczowe umiejętności to Święte Uzdrowienie (leczenie pojedynczego celu), Modlitwa Grupowa (leczenie obszarowe) i Błogosławieństwo (buff zwiększający statystyki drużyny). Kapłan może też zadawać obrażenia mrocznym istotom i nekromantom za pomocą zaklęć Świętego Ognia.\n\nRekomendowane statystyki: Mądrość (WIS) jako główna – zwiększa efektywność leczenia i Mana Point. Uzupełnij o Inteligencję (INT) jeśli chcesz grać bardziej ofensywnie jako Kapłan-Kara.'
      },
      {
        slug: 'lotrzyk',
        title: 'Łotrzyk',
        content:
          'Łotrzyk to mobilna klasa walki w zwarciu, polegająca na szybkich atakach, unikach i zadawaniu obrażeń zza pleców wroga. Jest mistrzem pojedynków jeden na jeden i doskonałym zabójcą, potrafiącym wyeliminować cel zanim zdąży zareagować.\n\nNajważniejsza umiejętność to Cios w Plecy — zadaje potrójne obrażenia gdy Łotrzyk atakuje z tyłu lub ze stanu Niewidzialności. Inne kluczowe skille to Trucizna (obrażenia w czasie) i Dymna Bomba (zmniejsza celność wrogów).\n\nRekomendowane statystyki: Zręczność (DEX) jako główna zapewnia szybkość ataku i szansę trafienia, uzupełniona o Siłę (STR) dla wzrostu bazowych obrażeń. Używaj sztyletów lub krótkich mieczy — im wyższa prędkość ataku, tym częściej procsują się umiejętności pasywne.'
      },
      {
        slug: 'templariusz',
        title: 'Templariusz',
        content:
          'Templariusz łączy odporność Wojownika ze zdolnościami leczniczymi Kapłana, tworząc klasę o wyjątkowej przeżywalności. Choć nie dorównuje specjalistom w swoich dziedzinach, jego wszechstronność sprawia, że świetnie radzi sobie zarówno w solo jak i wspomaganiu drużyny.\n\nUnikalna umiejętność Święta Tarcza pozwala Templariuszowi przez kilka sekund stać się nietykalnym, pochłaniając wszelkie obrażenia. Aura Ochronna stale regeneruje HP pobliskich sojuszników, czyniąc go cennym w każdym składzie.\n\nRekomendowane statystyki: Mix Siły (STR) i Wytrzymałości (VIT) w stosunku 3:2. Używaj buław i maczug dla premii do obrażeń świętych zaklęć. Ciężki pancerz jest obowiązkowy — klasa nie korzysta z uników jak Łotrzyk.'
      },
      {
        slug: 'szaman',
        title: 'Szaman',
        content:
          'Szaman to hybryda wsparcia i obrażeń magicznych, przyzywająca duchy do walki i rzucająca potężne klątwy na wrogów. Wyróżnia się unikalną mechaniką Totemów — przyzywanych obiektów wzmacniających drużynę lub osłabiających przeciwników w wybranym obszarze.\n\nTotem Burzy zadaje ciągłe obrażenia od piorunów w obszarze, Totem Uzdrowienia regeneruje HP drużyny, a Klątwa Słabości znacząco redukuje obronę i atak wrogich bossów. Szaman jest szczególnie ceniony w rajdach ze względu na unikalne debuffs niedostępne innym klasom.\n\nRekomendowane statystyki: Mądrość (WIS) i Inteligencja (INT) w równych proporcjach. Szaman jest jedną z trudniejszych klas dla nowych graczy ze względu na złożoność zarządzania Totemami w czasie rzeczywistej walki.'
      }
    ]
  },
  {
    slug: 'przedmioty',
    label: 'Przedmioty',
    description: 'Broń, pancerze, materiały i inne przedmioty.',
    entries: [
      { slug: 'miecz-stalowy', title: 'Miecz stalowy', content: '' },
      { slug: 'luk-elfow', title: 'Łuk elfów', content: '' },
      { slug: 'rozdzka-ognia', title: 'Różdżka ognia', content: '' },
      { slug: 'zbroja-smoka', title: 'Zbroja smoka', content: '' }
    ]
  }
];
