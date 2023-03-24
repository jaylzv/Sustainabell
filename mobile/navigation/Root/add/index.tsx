import { AddActivity } from "./AddActivity";
import { AddQuestion } from "./AddQuestion";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

const Tab = createBottomTabNavigator();

export const AddTabNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          switch (route.name) {
            case "Question":
              iconName = focused ? "stop" : "stop-outline";
              break;
            case "Activity":
              iconName = focused ? "shapes" : "shapes-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Question"
        component={AddQuestion}
        options={{ headerTitle: "Add Question" }}
      />
      <Tab.Screen
        name="Activity"
        component={AddActivity}
        options={{ headerTitle: "Add Activity" }}
      />
    </Tab.Navigator>
  );
};
