import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDailyChoices } from '@/src/hooks/useDailyChoices';
import { useSupabaseRealtime } from '@/src/hooks/useSupabaseRealtime';
import { useAuth } from '@/src/providers/AuthProvider';
import { Colors } from '@/src/constants/colors';
import { Strings } from '@/src/constants/strings';

export default function Dashboard() {
  const { family, signOut } = useAuth();
  const { childrenWithChoices, isLoading, refetch } = useDailyChoices();
  const router = useRouter();

  const handleChange = useCallback(() => {
    refetch();
  }, [refetch]);

  useSupabaseRealtime('daily_choices', family?.id, handleChange);
  useSupabaseRealtime('daily_choice_items', family?.id, handleChange);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>{Strings.todaysMeals}</Text>

      {childrenWithChoices.length === 0 && (
        <Text style={styles.empty}>{Strings.noItems}</Text>
      )}

      {childrenWithChoices.map((child) => (
        <View
          key={child.id}
          style={[styles.childRow, { borderStartColor: child.color }]}
        >
          <View style={styles.childHeader}>
            <Text style={styles.childEmoji}>{child.avatar_emoji}</Text>
            <Text style={styles.childName}>{child.name}</Text>
          </View>
          {child.daily_choice?.is_completed ? (
            <View style={styles.choices}>
              {child.daily_choice.daily_choice_items.map((item) => (
                <View key={item.id} style={styles.foodChip}>
                  <Text style={styles.foodChipText}>
                    {item.food_items.emoji} {item.food_items.name}
                  </Text>
                </View>
              ))}
              <Text style={styles.completeText}>{Strings.mealComplete}</Text>
            </View>
          ) : (
            <Text style={styles.noChoice}>{Strings.noChoicesYet}</Text>
          )}
        </View>
      ))}

      <Pressable
        onPress={() => router.push('/(child)')}
        style={styles.childModeButton}
      >
        <Text style={styles.childModeText}>{Strings.childMode}</Text>
      </Pressable>

      <Pressable onPress={signOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>התנתק</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  empty: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
  childRow: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderStartWidth: 4,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  childEmoji: {
    fontSize: 28,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  foodChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  foodChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  completeText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
  },
  noChoice: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  childModeButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  childModeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  signOutText: {
    color: Colors.error,
    fontSize: 15,
  },
});
