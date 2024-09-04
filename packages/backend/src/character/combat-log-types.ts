export type CombatLog = {
  type: 'attack' | 'initiative' | 'damage' | 'heal' | 'level-up' | 'xp-gain';
  round: number;
  actor: {
    id: number;
    name: string;
  };
  target: {
    id: number;
    name: string;
  };
  details: Record<string, string | number>;
};
