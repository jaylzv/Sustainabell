import * as React from "react";
import { FAB as DefaultFAB, Portal } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

export const FAB = () => {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  const navigation = useNavigation<any>();
  const { signout } = useAuth();
  return (
    <Portal>
      <DefaultFAB.Group
        open={open}
        visible
        icon={open ? "keyboard-return" : "plus"}
        actions={[
          { icon: "exit-to-app", onPress: signout },
          {
            icon: "map-marker-radius",
            label: "Add GeoQuestions",
            onPress: () => navigation.navigate("add", { screen: "Question" }),
          },
          {
            icon: "list-status",
            label: "Add Activities",
            onPress: () => navigation.navigate("add", { screen: "Activity" }),
          },
          {
            icon: "podium",
            label: "Leaderboard",
            onPress: () => navigation.navigate("leaderboard"),
          },
          {
            icon: "clipboard-list",
            label: "Daily Lookback",
            onPress: () => navigation.navigate("lookback"),
          },
          {
            icon: "help-box",
            label: "Question",
            onPress: () =>
              navigation.navigate("question", {
                questionId: "VWYm8hSQhAAbnK9svS2q",
              }),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};
