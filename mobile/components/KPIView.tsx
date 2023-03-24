import ProgressCircle from "react-native-progress-circle";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface KPIViewProps {
  progressValues: {
    value: number;
    name: string;
  }[];
}

export const KPIView: React.FC<KPIViewProps> = ({ progressValues }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company KPI's:</Text>
      <View style={styles.flexContainer}>
        {progressValues?.map((i, index) => (
          <ProgressCircle
            key={index}
            percent={i.value}
            radius={50}
            borderWidth={8}
            color={
              i.value > 85
                ? theme.colors.tertiary
                : i.value > 50
                ? theme.colors.secondary
                : theme.colors.error
            }
            shadowColor="#999"
            bgColor={theme.dark ? "#000" : "#fff"}
          >
            <Text style={{ fontSize: 18 }}>{i.value}%</Text>
            <Text style={{ fontSize: 12 }}>{i.name}</Text>
          </ProgressCircle>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 120,
    padding: 10,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
});
