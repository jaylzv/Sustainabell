import React, { useEffect, useState } from "react";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { backend } from "../lib/firebase";
import { Dimensions } from "react-native";
import { firstDayOfMonth } from "../utils";
import { httpsCallable } from "firebase/functions";
import { LineChart } from "react-native-chart-kit";
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";

export const RecentActivity = () => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
    legend: ["Watt Hours In Factory X"],
  });
  const { data: wattHoursHistory, isLoading } = useQuery(
    "wattHoursHistory",
    () =>
      httpsCallable(
        backend,
        "getWattage"
      )({
        date: firstDayOfMonth.toLocaleDateString("en-GB"),
        daysOfHistory: 21,
      })
  );

  useEffect(() => {
    if (wattHoursHistory) {
      setData({
        labels: [
          ...(Object.keys(wattHoursHistory?.data as Object) || []),
        ] as any, //.map((l: string) => l.slice(0, 2) + "|"),
        datasets: [
          {
            data: (
              (Object.values(wattHoursHistory?.data as Object) || []) as any
            ).map((l: number) => (l ? Math.round(l) : 0)),
          },
        ],
        legend: ["kWh In Factory X"],
      });
    }
  }, [wattHoursHistory]);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <LineChart
      data={data}
      height={220}
      chartConfig={{
        color: (opacity = 1) => theme.colors.primary,
        labelColor: (opacity = 1) => theme.colors.primary,
        strokeWidth: 7,
        propsForBackgroundLines: {
          strokeWidth: 0,
        },
      }}
      width={screenWidth - 24}
      formatYLabel={(y) => `${Math.floor(parseInt(y) / 1000)} kWh`}
      formatXLabel={(x) =>
        parseInt(x.slice(0, 2)) % 2 === 0 ? x.slice(0, 2) : ""
      }
      transparent
      bezier
    />
  );
};

const styles = StyleSheet.create({
  chart: {
    width: "100%",
  },
});
