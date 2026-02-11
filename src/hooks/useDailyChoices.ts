import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { ChildWithChoice } from '../types/database';

export function useDailyChoices() {
  const { family } = useAuth();
  const [childrenWithChoices, setChildrenWithChoices] = useState<ChildWithChoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchChoices = useCallback(async () => {
    if (!family) return;
    setIsLoading(true);

    // Get children with their choices for today
    const { data: children } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', family.id)
      .order('display_order');

    if (!children) {
      setIsLoading(false);
      return;
    }

    const { data: choices } = await supabase
      .from('daily_choices')
      .select('*, daily_choice_items(*, food_items(*))')
      .eq('family_id', family.id)
      .eq('choice_date', today);

    const merged: ChildWithChoice[] = children.map((child) => ({
      ...child,
      daily_choice: choices?.find((c) => c.child_id === child.id) ?? null,
    }));

    setChildrenWithChoices(merged);
    setIsLoading(false);
  }, [family, today]);

  useEffect(() => {
    fetchChoices();
  }, [fetchChoices]);

  async function submitChoice(childId: string, foodItemIds: string[]) {
    if (!family) return;

    // Upsert: delete existing choice for today, then insert new one
    const { data: existing } = await supabase
      .from('daily_choices')
      .select('id')
      .eq('child_id', childId)
      .eq('choice_date', today)
      .single();

    if (existing) {
      await supabase.from('daily_choice_items').delete().eq('daily_choice_id', existing.id);
      await supabase.from('daily_choices').delete().eq('id', existing.id);
    }

    const { data: choice, error } = await supabase
      .from('daily_choices')
      .insert({
        family_id: family.id,
        child_id: childId,
        choice_date: today,
        is_completed: true,
      })
      .select()
      .single();

    if (error || !choice) return error;

    const items = foodItemIds.map((food_item_id) => ({
      daily_choice_id: choice.id,
      food_item_id,
    }));

    const { error: itemsError } = await supabase
      .from('daily_choice_items')
      .insert(items);

    if (!itemsError) await fetchChoices();
    return itemsError;
  }

  return { childrenWithChoices, isLoading, submitChoice, refetch: fetchChoices };
}
