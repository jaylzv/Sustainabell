import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const AddActivity = () => {
  const [numberOfAnswers, setNumberOfAnswers] = useState(1);
  const [input, setInput] = useState({
    question: "",
    answers: {},
  });
  const { user } = useAuth();

  const createQuestion = () => {
    setDoc(doc(collection(db, "questions")), {
      question: input.question,
      answers: input.answers,
      createdBy: user?.uid,
      createdOn: Timestamp.now(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={30}
        style={styles.container}
      >
        <TextInput
          mode="outlined"
          label="Question"
          value={input.question}
          onChangeText={(question) => setInput({ ...input, question })}
          style={[styles.input, { minHeight: 100 }]}
          multiline
          numberOfLines={3}
        />
        {Array.from(Array(numberOfAnswers).keys()).map((i) => (
          <TextInput
            key={i}
            mode="outlined"
            label={`Answer ${i + 1}`}
            value={(input.answers as any)[i]}
            onChangeText={(text) =>
              setInput({
                ...input,
                answers: { ...input.answers, [i]: text },
              })
            }
            style={styles.input}
          />
        ))}
        <Button onPress={() => setNumberOfAnswers((a) => a + 1)}>
          Add Answer
        </Button>
      </KeyboardAvoidingView>

      <Button onPress={createQuestion} mode="contained">
        Save!
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 24,
  },
  input: {
    width: "100%",
    maxWidth: 400,
    marginVertical: 10,
  },
});
