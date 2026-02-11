export const CATEGORIES = ['main', 'side', 'produce', 'drink', 'snack'] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_EMOJIS: Record<Category, string> = {
  main: '🍽️',
  side: '🥗',
  produce: '🥕',
  drink: '🥤',
  snack: '🍪',
};
