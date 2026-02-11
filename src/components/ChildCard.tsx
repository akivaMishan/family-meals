import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import type { Child } from '../types/database';

interface ChildCardProps {
  child: Child;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: 'small' | 'large';
  subtitle?: string;
}

export function ChildCard({ child, onPress, onLongPress, size = 'small', subtitle }: ChildCardProps) {
  const isLarge = size === 'large';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        isLarge && styles.cardLarge,
        { backgroundColor: child.color + '20', borderColor: child.color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.emoji, isLarge && styles.emojiLarge]}>{child.avatar_emoji}</Text>
      <Text style={[styles.name, isLarge && styles.nameLarge]}>{child.name}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    minWidth: 100,
    minHeight: 100,
  },
  cardLarge: {
    minWidth: 140,
    minHeight: 140,
    padding: 24,
    borderRadius: 24,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emojiLarge: {
    fontSize: 56,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  nameLarge: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
