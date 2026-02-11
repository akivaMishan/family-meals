import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { FoodItem } from '../types/database';
import type { Category } from '../constants/categories';

export function useFoodItems() {
  const { family } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFoodItems = useCallback(async () => {
    if (!family) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('food_items')
      .select('*')
      .eq('family_id', family.id)
      .eq('is_active', true)
      .order('category')
      .order('name');
    setFoodItems(data ?? []);
    setIsLoading(false);
  }, [family]);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  async function addFoodItem(item: { name: string; emoji: string; category: Category }) {
    if (!family) return;
    const { error } = await supabase.from('food_items').insert({
      family_id: family.id,
      name: item.name,
      emoji: item.emoji,
      category: item.category,
      is_active: true,
    });
    if (!error) await fetchFoodItems();
    return error;
  }

  async function updateFoodItem(id: string, updates: Partial<Pick<FoodItem, 'name' | 'emoji' | 'category'>>) {
    const { error } = await supabase
      .from('food_items')
      .update(updates)
      .eq('id', id);
    if (!error) await fetchFoodItems();
    return error;
  }

  async function deleteFoodItem(id: string) {
    // Soft delete
    const { error } = await supabase
      .from('food_items')
      .update({ is_active: false })
      .eq('id', id);
    if (!error) await fetchFoodItems();
    return error;
  }

  function getByCategory(category: Category | null) {
    if (!category) return foodItems;
    return foodItems.filter((item) => item.category === category);
  }

  return { foodItems, isLoading, addFoodItem, updateFoodItem, deleteFoodItem, getByCategory, refetch: fetchFoodItems };
}
