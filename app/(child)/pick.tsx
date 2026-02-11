import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFoodItems } from '@/src/hooks/useFoodItems';
import { FoodItemCard } from '@/src/components/FoodItemCard';
import { CategoryFilter } from '@/src/components/CategoryFilter';
import { Colors } from '@/src/constants/colors';
import { Strings } from '@/src/constants/strings';
import type { Category } from '@/src/constants/categories';

export default function FoodPicker() {
  const { childId, childName, childEmoji } = useLocalSearchParams<{
    childId: string;
    childName: string;
    childEmoji: string;
  }>();
  const { foodItems, getByCategory } = useFoodItems();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = getByCategory(selectedCategory);

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleConfirm() {
    if (selectedIds.size === 0) return;
    const selectedItems = foodItems
      .filter((item) => selectedIds.has(item.id))
      .map((item) => ({ id: item.id, name: item.name, emoji: item.emoji }));

    router.push({
      pathname: '/(child)/confirm',
      params: {
        childId,
        childName,
        childEmoji,
        items: JSON.stringify(selectedItems),
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{childEmoji}</Text>
        <Text style={styles.headerName}>{childName}</Text>
        <Text style={styles.headerSub}>{Strings.pickFood}</Text>
      </View>

      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FoodItemCard
            item={item}
            selected={selectedIds.has(item.id)}
            onPress={() => toggleItem(item.id)}
          />
        )}
      />

      {selectedIds.size > 0 && (
        <View style={styles.tray}>
          <Text style={styles.trayCount}>
            {Strings.myChoices} ({selectedIds.size})
          </Text>
          <View style={styles.trayItems}>
            {foodItems
              .filter((item) => selectedIds.has(item.id))
              .map((item) => (
                <Text key={item.id} style={styles.trayEmoji}>
                  {item.emoji}
                </Text>
              ))}
          </View>
          <Pressable onPress={handleConfirm} style={styles.confirmBtn}>
            <Text style={styles.confirmText}>{Strings.confirm}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 8,
  },
  headerEmoji: {
    fontSize: 48,
  },
  headerName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  headerSub: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 120,
    gap: 10,
  },
  row: {
    gap: 10,
    justifyContent: 'center',
  },
  tray: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    backgroundColor: Colors.surface,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  trayCount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  trayItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  trayEmoji: {
    fontSize: 28,
  },
  confirmBtn: {
    backgroundColor: Colors.success,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
