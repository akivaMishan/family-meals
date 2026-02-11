import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { Child } from '../types/database';

export function useChildren() {
  const { family } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    if (!family) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', family.id)
      .order('display_order');
    setChildren(data ?? []);
    setIsLoading(false);
  }, [family]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  async function addChild(child: { name: string; avatar_emoji: string; color: string }) {
    if (!family) return;
    const { error } = await supabase.from('children').insert({
      family_id: family.id,
      name: child.name,
      avatar_emoji: child.avatar_emoji,
      color: child.color,
      display_order: children.length,
    });
    if (!error) await fetchChildren();
    return error;
  }

  async function updateChild(id: string, updates: Partial<Pick<Child, 'name' | 'avatar_emoji' | 'color'>>) {
    const { error } = await supabase
      .from('children')
      .update(updates)
      .eq('id', id);
    if (!error) await fetchChildren();
    return error;
  }

  async function deleteChild(id: string) {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', id);
    if (!error) await fetchChildren();
    return error;
  }

  return { children, isLoading, addChild, updateChild, deleteChild, refetch: fetchChildren };
}
