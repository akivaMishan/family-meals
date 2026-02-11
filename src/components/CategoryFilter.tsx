import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { CATEGORIES, CATEGORY_EMOJIS, type Category } from '../constants/categories';
import { Strings } from '../constants/strings';

interface CategoryFilterProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[styles.chip, !selected && styles.chipActive]}
      >
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>
          {Strings.allCategories}
        </Text>
      </Pressable>
      {CATEGORIES.map((cat) => (
        <Pressable
          key={cat}
          onPress={() => onSelect(cat)}
          style={[styles.chip, selected === cat && styles.chipActive]}
        >
          <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>
            {CATEGORY_EMOJIS[cat]} {Strings.categories[cat]}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
