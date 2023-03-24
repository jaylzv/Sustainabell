import { ActivityItem } from "../types";
import { db } from "../lib/firebase";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { midnightTimestamp } from "../utils";
import { Text, useTheme } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const ActivityList = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", user?.uid!, "activity"),
      (snapshot) => {
        setActivityItems(
          snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as ActivityItem)
          )
        );
      }
    );
    return unsubscribe;
  }, []);

  const updateItem = (id: string) => {
    const item = activityItems.find((item) => item.id === id);
    if (!item) return;
    updateDoc(doc(db, "users", user?.uid!, "activity", id), {
      completedAt: item?.completedAt ? null : Timestamp.now(),
    });
    updateDoc(doc(db, "users", user?.uid!), {
      points:
        (user?.points || 0) + (item?.completedAt ? -item.points : item.points),
    });

    setDoc(
      doc(db, "users", user?.uid!, "history", `${midnightTimestamp().seconds}`),
      {
        points: item?.completedAt
          ? user?.points! - item?.points
          : user?.points! + item?.points,
      }
    );
  };

  return (
    <FlatList
      scrollEnabled={false}
      data={activityItems}
      renderItem={({ item }) => {
        const renderDueDate = item.dueDate
          ? ` - Due ${item.dueDate.toDate().toLocaleDateString()}`
          : "";

        const isPastDueDate = item.dueDate
          ? item.dueDate.toDate() < new Date()
          : false;

        const activeColor = () => {
          if (item.completedAt) {
            return theme.colors.tertiary;
          } else if (isPastDueDate) {
            return theme.colors.error;
          } else {
            return "gray";
          }
        };

        return (
          <TouchableOpacity
            style={[
              styles.box,
              {
                borderColor: activeColor(),
                borderWidth: 2,
                backgroundColor: item.completedAt && `rgba(5, 144, 5, 0.11)`,
              },
            ]}
            onPress={() => updateItem(item.id)}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.primary,
              }}
            >
              {item.title}
            </Text>
            <Text>{item.description}</Text>
            <Text style={{ color: "gray" }}>
              {item.completedAt
                ? "Completed"
                : `Not completed ${renderDueDate}`}
            </Text>
            <Text style={[styles.points, { color: theme.colors.primary }]}>
              {item.points} points
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
  },
  points: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
