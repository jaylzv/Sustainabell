import { AuthScreenProps } from ".";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const SignInScreen: React.FC<AuthScreenProps<"signin">> = ({
  navigation,
}) => {
  const theme = useTheme();
  const { signin, loading, error } = useAuth();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    await signin(input.password, input.email);
  };

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
          Welcome back!
        </Text>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.container}
          keyboardVerticalOffset={80}
        >
          <Text style={{ color: theme.colors.error }}>{error}</Text>
          <TextInput
            style={styles.textInput}
            mode="outlined"
            label="Email"
            value={input.email}
            onChangeText={(email) => setInput((i) => ({ ...i, email }))}
            keyboardType="email-address"
          />
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="Password"
            secureTextEntry
            value={input.password}
            onChangeText={(password) => setInput((i) => ({ ...i, password }))}
            onSubmitEditing={handleSignIn}
          />

          <Button
            style={{ margin: 6 }}
            mode="outlined"
            onPress={handleSignIn}
            loading={loading}
            disabled={
              !input.email || !input.password || input.password.length < 6
            }
          >
            Sign In
          </Button>
        </KeyboardAvoidingView>
        <View style={styles.container}>
          <Text>Don't yet have an account?</Text>
          <Button
            style={{ margin: 6 }}
            mode="outlined"
            onPress={() => navigation.navigate("signup")}
          >
            Create an account
          </Button>
        </View>
        {/* <Image
          source={require("../../assets/water.jpg")}
          style={{
            position: "absolute",
            zIndex: -10,
            opacity: 0.1,
          }}
        /> */}
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
