import React, { useEffect, useState } from "react";
import { backend, db } from "../../lib/firebase";
import { Button, Text } from "react-native-paper";
import { collection, onSnapshot } from "firebase/firestore";
import { firstDayInPreviousMonth, firstDayOfMonth } from "../../utils";
import { httpsCallable } from "firebase/functions";
import { Question } from "../../types";
import { RootScreenProps } from ".";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "react-query";
import {
  ActivityList,
  FAB,
  KPIView,
  RecentActivity,
  StreakInfo,
} from "../../components";

export const HomeScreen: React.FC<RootScreenProps<"home">> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);

  const { data: wattHoursThisMonth } = useQuery("wattHoursThisMonth", () =>
    httpsCallable(
      backend,
      "getWattage"
    )({ date: firstDayOfMonth.toLocaleDateString("en-GB") })
  );

  const { data: wattHoursLastMonth } = useQuery("wattHoursLastMonth", () =>
    httpsCallable(
      backend,
      "getWattage"
    )({ date: firstDayInPreviousMonth.toLocaleDateString("en-GB") })
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
      setQuestions(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Question))
      );
    });
    return unsubscribe;
  }, []);

  const wattHourDifference = Math.floor(
    ((wattHoursThisMonth as any)?.data * 100) /
      (wattHoursLastMonth as any)?.data
  );

  const progressValues = [
    { value: wattHourDifference, name: "kWh" },
    { value: 46, name: "h2o" },
    { value: 76, name: "co2" },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        <StreakInfo />
        <KPIView progressValues={progressValues} />
        <RecentActivity />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            padding: 12,
            marginTop: 12,
          }}
        >
          Your daily activity list:
        </Text>
        <ActivityList />
        <View style={{ paddingBottom: 32 }} />
      </ScrollView>
      <FAB />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});
