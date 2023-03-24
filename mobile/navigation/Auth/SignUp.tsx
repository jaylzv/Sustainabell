import { Button, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

export const SignUpScreen: React.FC = () => {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
  });
  const { loading, signup, error } = useAuth();
  const theme = useTheme();

  const handleSignUp = async () => {
    await signup(input.email, input.password, {
      firstName: input.firstName,
      lastName: input.lastName,
    });
  };

  const errors = {
    firstName: input.firstName.length < 2,
    lastName: input.lastName.length < 2,
    email: input.email.length < 2,
    password: input.password.length < 6,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: "100%", height: 200, marginBottom: 48 }}
          resizeMode="contain"
        />
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          keyboardVerticalOffset={20}
        >
          {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="First Name"
            onChangeText={(firstName) => setInput((i) => ({ ...i, firstName }))}
            value={input.firstName}
            error={errors.firstName}
          />

          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="Last Name"
            onChangeText={(lastName) => setInput((i) => ({ ...i, lastName }))}
            value={input.lastName}
            error={errors.lastName}
          />

          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="Company email"
            onChangeText={(email) => setInput((i) => ({ ...i, email }))}
            value={input.email}
            keyboardType="email-address"
            error={errors.email}
          />

          <TextInput
            mode="outlined"
            style={[styles.textInput]}
            label="Password"
            secureTextEntry
            value={input.password}
            onChangeText={(password) => setInput((i) => ({ ...i, password }))}
            error={errors.password}
          />
          <Button
            onPress={handleSignUp}
            disabled={
              errors.email ||
              errors.password ||
              errors.firstName ||
              errors.lastName
            }
            loading={loading}
          >
            Sign Up
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  textInput: { width: 280, height: 60, margin: 5 },
});
