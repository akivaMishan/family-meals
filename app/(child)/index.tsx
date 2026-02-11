import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useChildren } from '@/src/hooks/useChildren';
import { ChildCard } from '@/src/components/ChildCard';
import { Colors } from '@/src/constants/colors';
import { Strings } from '@/src/constants/strings';

export default function ChildSelector() {
  const { children } = useChildren();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Strings.selectChild}</Text>
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChildCard
            child={item}
            size="large"
            onPress={() =>
              router.push({
                pathname: '/(child)/pick',
                params: { childId: item.id, childName: item.name, childEmoji: item.avatar_emoji },
              })
            }
          />
        )}
      />
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>{Strings.parentMode}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  list: {
    paddingHorizontal: 24,
    gap: 16,
  },
  row: {
    gap: 16,
    justifyContent: 'center',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
  },
});
