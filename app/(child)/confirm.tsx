import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDailyChoices } from '@/src/hooks/useDailyChoices';
import { Colors } from '@/src/constants/colors';
import { Strings } from '@/src/constants/strings';

interface SelectedItem {
  id: string;
  name: string;
  emoji: string;
}

export default function ConfirmScreen() {
  const { childId, childName, childEmoji, items } = useLocalSearchParams<{
    childId: string;
    childName: string;
    childEmoji: string;
    items: string;
  }>();
  const { submitChoice } = useDailyChoices();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scale] = useState(new Animated.Value(0));

  const selectedItems: SelectedItem[] = items ? JSON.parse(items) : [];

  async function handleSubmit() {
    if (loading) return;
    setLoading(true);
    await submitChoice(childId, selectedItems.map((i) => i.id));
    setSubmitted(true);
    setLoading(false);

    // Celebration animation
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.dismissAll();
        router.replace('/(child)');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  if (submitted) {
    return (
      <View style={styles.celebration}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={styles.celebrationEmoji}>{childEmoji}</Text>
          <Text style={styles.celebrationText}>{Strings.yay}</Text>
          <Text style={styles.celebrationSub}>{Strings.mealReady}</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{childEmoji}</Text>
        <Text style={styles.headerName}>{childName}</Text>
      </View>

      <Text style={styles.sectionTitle}>{Strings.myChoices}</Text>

      <View style={styles.itemsGrid}>
        {selectedItems.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{Strings.cancel}</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.submitBtn, loading && styles.btnDisabled]}
        >
          <Text style={styles.submitText}>
            {loading ? Strings.loading : Strings.done}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 56,
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
  item: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingBottom: 40,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  celebration: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  celebrationText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  celebrationSub: {
    fontSize: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
