export const Strings = {
  // App
  appName: 'בחירת ארוחות',

  // Auth
  signIn: 'התחברות',
  signUp: 'הרשמה',
  email: 'אימייל',
  password: 'סיסמה',
  familyName: 'שם המשפחה',
  noAccount: 'אין לך חשבון?',
  hasAccount: 'יש לך חשבון?',
  signInAction: 'התחבר',
  signUpAction: 'הירשם',

  // Parent tabs
  dashboard: 'לוח בקרה',
  children: 'ילדים',
  food: 'מאכלים',

  // Children management
  addChild: 'הוסף ילד',
  editChild: 'ערוך ילד',
  deleteChild: 'מחק ילד',
  childName: 'שם הילד',
  selectEmoji: 'בחר אימוג\'י',
  selectColor: 'בחר צבע',
  save: 'שמור',
  cancel: 'ביטול',
  delete: 'מחק',
  confirmDelete: 'האם למחוק?',

  // Food management
  addFood: 'הוסף מאכל',
  editFood: 'ערוך מאכל',
  foodName: 'שם המאכל',
  allCategories: 'הכל',

  // Categories
  categories: {
    main: 'עיקרית',
    side: 'תוספת',
    produce: 'ירקות ופירות',
    drink: 'שתייה',
    snack: 'חטיף',
  } as Record<string, string>,

  // Child mode
  selectChild: 'מי אוכל?',
  pickFood: 'מה אוכלים?',
  myChoices: 'הבחירות שלי',
  confirm: 'אישור',
  done: 'סיום',
  yay: 'יופי! 🎉',
  mealReady: 'הארוחה מוכנה!',

  // Dashboard
  todaysMeals: 'ארוחות היום',
  noChoicesYet: 'עדיין לא בחר',
  mealComplete: 'הארוחה מוכנה ✓',
  childMode: 'מצב ילדים',
  parentMode: 'מצב הורים',

  // Common
  loading: 'טוען...',
  error: 'שגיאה',
  retry: 'נסה שוב',
  noItems: 'אין פריטים',
} as const;
