import { AuthScreenProps } from ".";
import { Button, Text, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const EntryScreen: React.FC<AuthScreenProps<"entry">> = ({
  navigation,
}) => {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 48,
            marginVertical: 12,
            alignSelf: "flex-start",
            padding: 12,
            fontWeight: "300",
            maxWidth: 300,
            color: theme.colors.primary,
          }}
        >
          Improve your eco footprint
        </Text>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <Image
            source={require("../../assets/urban.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/desert.png")}
            style={styles.image}
          />
        </View>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <Image
            source={require("../../assets/waste.png")}
            style={styles.image}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("signin")}
            activeOpacity={0.8}
            style={[
              styles.image,
              {
                backgroundColor: theme.colors.primary,
                borderTopLeftRadius: 0,
                borderBottomRightRadius: 0,
                opacity: 1,
              },
            ]}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: 20,
                padding: 24,
              }}
            >
              Sign In
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              style={{ bottom: 0, right: 0, position: "absolute", padding: 24 }}
            />
          </TouchableOpacity>
        </View>
        <Button
          onPress={() => navigation.navigate("signup")}
          style={{ marginTop: 12 }}
        >
          Create an account
        </Button>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textInput: { width: 280, height: 60, margin: 10 },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  image: {
    // width: "40%",
    flex: 1,
    aspectRatio: 1,
    borderRadius: 28,
    margin: 4,
    opacity: 0.65,
  },
});
