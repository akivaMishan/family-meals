import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseRealtime(
  table: string,
  familyId: string | undefined,
  onChange: () => void
) {
  useEffect(() => {
    if (!familyId) return;

    const channel = supabase
      .channel(`${table}_${familyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `family_id=eq.${familyId}`,
        },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, familyId, onChange]);
}
