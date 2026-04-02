import {
  IconBooks,
  IconBuildingStore,
  IconCalendarEvent,
  IconChristmasBall,
  IconChristmasTree,
  IconClipboardText,
  IconEgg,
  IconHome,
  IconMap2,
  IconShoppingBag,
  IconSpeakerphone,
  IconTrendingUp,
  IconTrophy
} from '@tabler/icons-react';
import type { ComponentType } from 'react';
import ComingSoon from '../components/ComingSoon';
import Announcement from '../pages/admin/Announcement';
import EasterEgg from '../pages/EasterEgg';
import Home from '../pages/Home';
import Ornament from '../pages/Ornament';
import Recruitment from '../pages/Recruitment';
import Tree from '../pages/Tree';

export interface NavItem {
  icon?: ComponentType<{ size?: number; stroke?: number }>;
  label: string;
  path: string;
  element: ComponentType;
  adminOnly?: boolean;
  submenu?: Array<{
    label: string;
    path: string;
    element: ComponentType;
  }>;
}

export interface NavSection {
  label: string;
  /** If true, section is only visible to authenticated users */
  protected?: boolean;
  /** If set, section is only shown when this seasonal flag is enabled */
  seasonal?: keyof typeof seasonalConfig;
  items: NavItem[];
}

/**
 * Toggle seasonal sections on/off.
 * Set a flag to `true` to show the section in the sidebar and register its routes.
 */
export const seasonalConfig = {
  christmas: false,
  easter: true
} as const;

export const navSections: NavSection[] = [
  {
    label: 'Główne',
    items: [
      { icon: IconHome, label: 'Strona główna', path: '/', element: Home },
      { icon: IconTrophy, label: 'Ranking', path: '/ranking', element: ComingSoon },
      {
        icon: IconClipboardText,
        label: 'Formularz zgłoszeniowy',
        path: '/register',
        element: Recruitment
      }
    ]
  },
  {
    label: 'Boże Narodzenie',
    protected: true,
    seasonal: 'christmas',
    items: [
      {
        icon: IconChristmasBall,
        label: 'Moja Bombka',
        path: '/bombka',
        element: Ornament
      },
      { icon: IconChristmasTree, label: 'Gorasuloinka', path: '/gorasuloinka', element: Tree }
    ]
  },
  {
    label: 'Wielkanoc',
    protected: true,
    seasonal: 'easter',
    items: [
      { icon: IconEgg, label: 'Moja Pisanka', path: '/pisanka', element: EasterEgg },
      { icon: IconShoppingBag, label: 'Gorasulanki', path: '/gorasulanki', element: ComingSoon }
    ]
  },
  {
    label: 'Informacje',
    protected: true,
    items: [
      { icon: IconBuildingStore, label: 'Rynek', path: '/market', element: ComingSoon },
      { icon: IconMap2, label: 'Mapa', path: '/map', element: ComingSoon },
      { icon: IconCalendarEvent, label: 'Aktualny event', path: '/event', element: ComingSoon },
      {
        icon: IconBooks,
        label: 'Wiki',
        path: '/wiki',
        element: ComingSoon,
        submenu: []
      }
    ]
  },
  {
    label: 'Administracja',
    protected: true,
    items: [
      {
        icon: IconTrendingUp,
        label: 'Ranking upload',
        path: '/admin/ranking-upload',
        element: ComingSoon,
        adminOnly: true
      },
      {
        icon: IconSpeakerphone,
        label: 'Ogłoszenie Discord',
        path: '/admin/announcement',
        element: Announcement,
        adminOnly: true
      }
    ]
  }
];

/** Extra routes not in nav (no icon/label needed) */
export const extraRoutes = [
  { path: '/wiki/:category/:slug', element: ComingSoon, protected: true }
];
