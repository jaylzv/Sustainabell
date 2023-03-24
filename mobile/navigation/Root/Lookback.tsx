import React from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { ActivityItem } from "../../types";
import { backend, db } from "../../lib/firebase";
import { collection, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { RootScreenProps } from ".";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "react-query";

export const Lookback: React.FC<RootScreenProps<"lookback">> = ({}) => {
  const { user } = useAuth();
  const { data, isFetching, error } = useQuery("lookbackReport", async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", user?.uid!, "activity")
    );
    const docs = querySnapshot.docs.map((doc) => doc.data() as ActivityItem);

    const completedDocs = docs.filter(
      (d) =>
        d.completedAt >
        Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)))
    );

    const incompleteDocs = docs.filter((d) => !d.completedAt);

    const getPrompt = () => {
      var prompt = "";
      if (completedDocs.length > 0) {
        prompt +=
          "Today I completed " +
          completedDocs.map((i) => i.title).join(", ") +
          ", ";
      }
      if (incompleteDocs.length > 0) {
        prompt +=
          "Today I failed to complete " +
          incompleteDocs.map((i) => i.title).join(", ") +
          ", ";
      }
      return prompt;
    };

    const result = await httpsCallable(
      backend,
      "getReport"
    )({
      text: getPrompt(),
    });

    return result.data;
  });

  return isFetching ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text>Generating...</Text>
    </View>
  ) : error ? (
    <View style={styles.container}>
      <Text style={styles.title}>Error!</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Lookback</Text>
      <Text style={styles.subtitle}>Here's your daily report:</Text>
      <Text style={styles.text}>{data as string}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 1,
    marginVertical: 20,
    textAlign: "justify",
  },
});
