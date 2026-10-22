import { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Entry, loadHistory, clearHistory } from "@/lib/history";

export default function HistoryScreen() {
  const [items, setItems] = useState<Entry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setItems);
    }, []),
  );

  const clear = async () => {
    await clearHistory();
    setItems([]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        {items.length > 0 && (
          <Pressable onPress={clear}>
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, i) => `${item.time}-${i}`}
        ListEmptyComponent={
          <Text style={styles.empty}>No calculations yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.expr}>
              {item.expr} <Text style={styles.mode}>({item.mode})</Text>
            </Text>
            <Text style={styles.result}>= {item.result}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: "#fff", fontSize: 24 },
  clear: { color: "#4f7cff", fontSize: 16 },
  empty: { color: "#888", textAlign: "center", marginTop: 40 },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  expr: { color: "#aaa", fontSize: 16 },
  mode: { color: "#666", fontSize: 12 },
  result: { color: "#fff", fontSize: 22 },
});
