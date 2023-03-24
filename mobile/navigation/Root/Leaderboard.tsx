import React from "react";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import { backend } from "../../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { ScrollView, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";

type Leaderboard = {
  firstName: string;
  lastName: string;
  points: number;
  id: string;
};

export const Leaderboard = () => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useQuery("leaderboard", () =>
    httpsCallable(backend, "getLeaderboard")({ limit: 3 })
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading && <ActivityIndicator size="large" />}
      {(data?.data as Leaderboard[])?.map((d, i) => (
        <View
          key={d.id}
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 10,
            margin: 2,
            width: "100%",
            maxWidth: 300,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              flex: 0.1,
              padding: 10,
              fontWeight: "900",
              fontSize: i < 3 ? 28 : 18,
            }}
          >
            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
          </Text>
          <View
            style={{
              flex: 0.9,
              borderWidth: 2,
              borderColor: theme.colors.primary,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ textAlign: "center", fontWeight: i < 3 ? "700" : "500" }}
            >
              {d.firstName} {d.lastName}
            </Text>
            <Text style={{ textAlign: "center" }}>{d.points} points</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
