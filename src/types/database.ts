import type { Category } from '../constants/categories';

export interface Family {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Child {
  id: string;
  family_id: string;
  name: string;
  avatar_emoji: string;
  color: string;
  display_order: number;
  created_at: string;
}

export interface FoodItem {
  id: string;
  family_id: string;
  name: string;
  emoji: string;
  category: Category;
  is_active: boolean;
  created_at: string;
}

export interface DailyChoice {
  id: string;
  family_id: string;
  child_id: string;
  choice_date: string;
  is_completed: boolean;
  created_at: string;
}

export interface DailyChoiceItem {
  id: string;
  daily_choice_id: string;
  food_item_id: string;
}

// Joined types for queries
export interface DailyChoiceWithItems extends DailyChoice {
  daily_choice_items: (DailyChoiceItem & { food_items: FoodItem })[];
}

export interface ChildWithChoice extends Child {
  daily_choice?: DailyChoiceWithItems | null;
}

// Database type map for Supabase
export interface Database {
  public: {
    Tables: {
      families: {
        Row: Family;
        Insert: Omit<Family, 'id' | 'created_at'>;
        Update: Partial<Omit<Family, 'id' | 'created_at'>>;
      };
      children: {
        Row: Child;
        Insert: Omit<Child, 'id' | 'created_at'>;
        Update: Partial<Omit<Child, 'id' | 'created_at'>>;
      };
      food_items: {
        Row: FoodItem;
        Insert: Omit<FoodItem, 'id' | 'created_at'>;
        Update: Partial<Omit<FoodItem, 'id' | 'created_at'>>;
      };
      daily_choices: {
        Row: DailyChoice;
        Insert: Omit<DailyChoice, 'id' | 'created_at'>;
        Update: Partial<Omit<DailyChoice, 'id' | 'created_at'>>;
      };
      daily_choice_items: {
        Row: DailyChoiceItem;
        Insert: Omit<DailyChoiceItem, 'id'>;
        Update: Partial<Omit<DailyChoiceItem, 'id'>>;
      };
    };
  };
}
