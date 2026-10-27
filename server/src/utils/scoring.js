export const DIFFICULTY_CONFIG = {
  easy: {
    suspectsCount: 3,
    cluesCount: 5,
    hintsCount: 2,
    baseScore: 100,
  },
  medium: {
    suspectsCount: 4,
    cluesCount: 7,
    hintsCount: 3,
    baseScore: 150,
  },
  hard: {
    suspectsCount: 5,
    cluesCount: 9,
    hintsCount: 3,
    baseScore: 200,
  },
};

export const CLUE_BONUS_POINTS = 5;
export const HINT_PENALTY_POINTS = 10;

export function calculateScore({ difficulty, isCorrect, discoveredCluesCount = 0, usedHintsCount = 0 }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const base = isCorrect ? config.baseScore : 0;
  const cluesBonus = discoveredCluesCount * CLUE_BONUS_POINTS;
  const hintsDeduction = usedHintsCount * HINT_PENALTY_POINTS;
  const total = Math.max(0, base + cluesBonus - hintsDeduction);

  return {
    base,
    cluesBonus,
    hintsDeduction,
    total,
  };
}
