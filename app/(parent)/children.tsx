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
import { useChildren } from '@/src/hooks/useChildren';
import { ChildCard } from '@/src/components/ChildCard';
import { Colors } from '@/src/constants/colors';
import { Strings } from '@/src/constants/strings';
import type { Child } from '@/src/types/database';

const EMOJIS = ['👦', '👧', '👶', '🧒', '👱‍♀️', '👱‍♂️', '🧒🏻', '🧒🏽', '🧒🏿', '👸', '🤴', '🦸‍♂️', '🦸‍♀️', '🐱', '🐶', '🦊', '🐰', '🐻', '🦁', '🐸'];

export default function ChildrenScreen() {
  const { children, addChild, updateChild, deleteChild } = useChildren();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Child | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👦');
  const [color, setColor] = useState<string>(Colors.childColors[0]);

  function openAdd() {
    setEditing(null);
    setName('');
    setEmoji('👦');
    setColor(Colors.childColors[children.length % Colors.childColors.length]);
    setModalVisible(true);
  }

  function openEdit(child: Child) {
    setEditing(child);
    setName(child.name);
    setEmoji(child.avatar_emoji);
    setColor(child.color);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    if (editing) {
      await updateChild(editing.id, { name: name.trim(), avatar_emoji: emoji, color });
    } else {
      await addChild({ name: name.trim(), avatar_emoji: emoji, color });
    }
    setModalVisible(false);
  }

  function handleDelete(child: Child) {
    Alert.alert(Strings.confirmDelete, child.name, [
      { text: Strings.cancel, style: 'cancel' },
      {
        text: Strings.delete,
        style: 'destructive',
        onPress: () => deleteChild(child.id),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChildCard
            child={item}
            onPress={() => openEdit(item)}
            onLongPress={() => handleDelete(item)}
          />
        )}
        ListFooterComponent={
          <Pressable onPress={openAdd} style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>{Strings.addChild}</Text>
          </Pressable>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editing ? Strings.editChild : Strings.addChild}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={Strings.childName}
              value={name}
              onChangeText={setName}
              textAlign="right"
              autoFocus
            />

            <Text style={styles.label}>{Strings.selectEmoji}</Text>
            <View style={styles.emojiGrid}>
              {EMOJIS.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[styles.emojiOption, emoji === e && styles.emojiSelected]}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>{Strings.selectColor}</Text>
            <View style={styles.colorGrid}>
              {Colors.childColors.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.colorSelected,
                  ]}
                />
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
    padding: 16,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: 24,
    marginTop: 12,
  },
  addIcon: {
    fontSize: 32,
    color: Colors.textSecondary,
  },
  addText: {
    fontSize: 16,
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
    maxHeight: '80%',
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: Colors.text,
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
