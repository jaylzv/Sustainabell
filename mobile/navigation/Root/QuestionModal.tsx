import React, { useState } from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Question } from "../../types";
import { RootScreenProps } from ".";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "react-query";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const QuestionModal: React.FC<RootScreenProps<"question">> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { questionId } = route.params;
  const { data, isLoading } = useQuery("getQuestion", async () => {
    if (!questionId) {
      return null;
    }
    const data = await getDoc(doc(db, "questions", questionId));
    if (data.exists()) {
      return data.data() as Question;
    } else {
      return null;
    }
  });
  const [submitted, setSubmitted] = useState("");

  const submitAnswer = (answer: string) => {
    setDoc(doc(collection(db, "users", user?.uid!, "submittedAnswers")), {
      time: Timestamp.now(),
      question: data?.question,
      questionId,
      answer,
    });
    setSubmitted(answer);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const animatedStyles = useAnimatedStyle(() => {
    if (!submitted || data?.type !== "binary") {
      return {
        transform: [
          {
            scale: 0,
          },
        ],
      };
    }
    return {
      transform: [
        {
          scale: withSequence(
            withTiming(2.5, { duration: 100 }),
            withSpring(1.0)
          ),
        },
      ],
    };
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{data?.question}</Text>
      <Animated.View style={animatedStyles} entering={FadeIn}>
        <Text style={{ fontSize: 24 }}>👍</Text>
      </Animated.View>
      <View style={styles.answersContainer}>
        {data?.answers.map((answer, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.answerContainer,
              {
                borderColor:
                  submitted === answer ? theme.colors.primary : "#ccc6c6",
              },
            ]}
            onPress={() => submitAnswer(answer)}
            disabled={!!submitted}
          >
            <Text>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
  },
  answersContainer: {
    width: "100%",
    maxWidth: 500,
    padding: 10,
  },
  answerContainer: {
    width: "100%",
    padding: 20,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
});
