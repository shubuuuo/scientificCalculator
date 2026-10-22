import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "calc_history";

export type Entry = {
  expr: string;
  result: string;
  mode: string;
  time: number;
};

export async function loadHistory(): Promise<Entry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addHistory(entry: Entry) {
  const list = await loadHistory();
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify([entry, ...list].slice(0, 50)),
  );
}

export async function clearHistory() {
  await AsyncStorage.removeItem(KEY);
}
