export interface EventReward {
  quantity: number;
  name: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  rewards?: EventReward[];
}

export const events: GameEvent[] = [
  {
    id: 'boss-hunting-april-2026',
    title: 'Boss Hunting Event',
    active: true,
    startDate: '2026-03-31',
    endDate: '2026-04-02',
    description:
      'Starting after maintenance and lasting until April 2, the boss hunting event shall begin.\n\nAcross the world of Gaia you can find bosses ranging on a difficulty scale between 1 and 6. Kill them and get a random reward! The harder the difficulty, the more likely you are to receive 2 rewards!',
    rewards: [
      { quantity: 20, name: 'Battle Crystal Box' },
      { quantity: 20, name: 'Battle Potion Box' },
      { quantity: 3, name: 'Honey Bread' },
      { quantity: 3, name: 'Honey Water' },
      { quantity: 13, name: 'Random Buff Card' },
      { quantity: 4, name: 'Stamina Saver' },
      { quantity: 4, name: 'Animal Cracker' },
      { quantity: 6, name: "God Mother Fairy's Bottle" },
      { quantity: 1, name: 'Power of Change: Medal' },
      { quantity: 15, name: 'Powerful Scroll of Creature Taming' },
      { quantity: 20, name: "Giant's Nail" },
      { quantity: 4, name: 'Lucky Potion' },
      { quantity: 15, name: 'Creature Res Spellbook' },
      { quantity: 20, name: 'Event Dark Cube' },
      { quantity: 8, name: 'Placeholder for world buffs' },
      { quantity: 26, name: 'Lv2 Potion Bottle' },
      { quantity: 8, name: 'Altered Almighty Pieces (Enhanced)' },
      { quantity: 8, name: 'Purified Almighty Pieces (Enhanced)' },
      { quantity: 13, name: 'Energy of Gold' },
      { quantity: 8, name: "Deva's Blessing" },
      { quantity: 4, name: 'Blessed Power of Change: Armor' },
      { quantity: 4, name: 'Impact Amplifier' },
      { quantity: 7, name: 'Numbered Box' },
      { quantity: 1, name: 'E-Protect' },
      { quantity: 1, name: 'E-Repair' }
    ]
  }
];
