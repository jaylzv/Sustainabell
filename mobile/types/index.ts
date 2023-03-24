import { GeofencingEventType, LocationRegion } from "expo-location";
import { Timestamp } from "firebase/firestore";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completedAt: Timestamp;
  createdAt: Timestamp;
  points: number;
};

export type Question = {
  id: string;
  question: string;
  answers: string[];
  type: "binary" | "singleAnswer";
};

export type Region = {
  id: string;
  eventType: GeofencingEventType.Enter | GeofencingEventType.Exit;
  region: LocationRegion;
};
