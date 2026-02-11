import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFoodItems } from '@/src/hooks/useFoodItems';
import { FoodItemCard } from '@/src/components/FoodItemCard';
import { CategoryFilter } from '@/src/components/CategoryFilter';
import { Colors } from '@/src/constants/colors';
import { Strings } from '@/src/constants/strings';
import { CATEGORIES, CATEGORY_EMOJIS, type Category } from '@/src/constants/categories';
import type { FoodItem } from '@/src/types/database';

const FOOD_EMOJIS = ['🍕', '🍝', '🍗', '🥩', '🍔', '🌮', '🥙', '🍚', '🍜', '🥗', '🥒', '🍅', '🥕', '🍎', '🍌', '🥤', '🧃', '💧', '🍪', '🍰', '🧁', '🍫', '🍿', '🥨'];

export default function FoodScreen() {
  const { foodItems, addFoodItem, deleteFoodItem, getByCategory } = useFoodItems();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍕');
  const [category, setCategory] = useState<Category>('main');

  const filtered = getByCategory(selectedCategory);

  function openAdd() {
    setName('');
    setEmoji('🍕');
    setCategory(selectedCategory ?? 'main');
    setModalVisible(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    await addFoodItem({ name: name.trim(), emoji, category });
    setModalVisible(false);
  }

  function handleDelete(item: FoodItem) {
    Alert.alert(Strings.confirmDelete, item.name, [
      { text: Strings.cancel, style: 'cancel' },
      {
        text: Strings.delete,
        style: 'destructive',
        onPress: () => deleteFoodItem(item.id),
      },
    ]);
  }

  return (
    <View style={styles.container}>
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
            onLongPress={() => handleDelete(item)}
          />
        )}
        ListFooterComponent={
          <Pressable onPress={openAdd} style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>{Strings.addFood}</Text>
          </Pressable>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{Strings.addFood}</Text>

            <TextInput
              style={styles.input}
              placeholder={Strings.foodName}
              value={name}
              onChangeText={setName}
              textAlign="right"
              autoFocus
            />

            <Text style={styles.label}>{Strings.selectEmoji}</Text>
            <View style={styles.emojiGrid}>
              {FOOD_EMOJIS.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[styles.emojiOption, emoji === e && styles.emojiSelected]}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>קטגוריה</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                    {CATEGORY_EMOJIS[cat]} {Strings.categories[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>{Strings.cancel}</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveText}>{Strings.save}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  row: {
    gap: 10,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: 20,
    marginTop: 12,
  },
  addIcon: {
    fontSize: 28,
    color: Colors.textSecondary,
  },
  addText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  emojiSelected: {
    backgroundColor: Colors.primary + '30',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  emojiText: {
    fontSize: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: 13,
    color: Colors.text,
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
