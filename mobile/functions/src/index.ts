import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Configuration, OpenAIApi } from "openai";

var serviceAccount = require("../keys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const OPENAI_API_KEY = "sk-.......................................";
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const wattage = require("./data.json") as {
  [key: string]: number;
};

export const getReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { text } = data;

  if (!text) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing argument"
    );
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant in assessing how sustainable one's actions are. I am going to give you data, and you respond with what the person is doing well, and perhaps one thing that the person could improve on, if there is something. Be respectful, but keep the sentences short and simple.",
      },
      { role: "user", content: text },
    ],
  });

  return response.data.choices[0].message?.content;
});

export const getWattage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { date, daysOfHistory } = data;

  if (!date) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing argument"
    );
  }

  if (daysOfHistory) {
    // const wattageHistory: any = {};

    // for (let i = 0; i < daysOfHistory; i++) {
    //   const date = new Date();
    //   date.setDate(date.getDate() - i);
    //   const dateString = date.toLocaleDateString("en-GB");

    //   wattageHistory[dateString] = wattage[dateString] || 0;
    // }

    // return wattageHistory;

    function parseDate(dateString: string) {
      const [day, month, year] = dateString.split("/");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const result: any = {};

    for (const key in wattage) {
      const date = parseDate(key);
      if (date >= thirtyDaysAgo && date <= today) {
        result[key] = wattage[key];
      }
    }
    return result;
  }

  return wattage[date];
});

const STARTING_QUESTIONS = [
  {
    completedAt: null,
    description: "No need to import food from far away 😉",
    points: 10,
    title: "Choose to consume local product",
  },
  {
    completedAt: null,
    description: "Don't be an environmental hater, use paper 🌍",
    points: 10,
    title: "Choose an alternative to plastic",
  },
  {
    completedAt: null,
    description: "Why need a car if you ain't gonna go far 🚴",
    points: 10,
    title: "Choose an alternative travel method",
  },
  {
    completedAt: null,
    description: "GYM GYM GYM",
    points: 10,
    title: "Worked out today",
  },
  {
    completedAt: null,
    description:
      "Budha said: 'Meditation is the best way to get rid of your problems'",
    points: 10,
    title: "Meditated for at least 10 minutes",
  },
  {
    completedAt: null,
    description: "Thank you for being a friend",
    points: 10,
    title: "Complimented a coworker",
  },
];

export const getLeaderboard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { limit } = data;

  if (!limit) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing argument"
    );
  }
  // const query = query(collectionGroup(db, 'landmarks'), where('type', '==', 'museum'))
  const users = await admin
    .firestore()
    .collection("users")
    .where("points", ">", 0)
    .orderBy("points", "desc")
    .limit(limit)
    .get();

  return users.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
});

exports.createStartingQuestions = functions.auth.user().onCreate((user) => {
  const ref = admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection("activity");
  STARTING_QUESTIONS.forEach((question) => {
    ref.doc().set(question);
  });

  const companyName = user.email?.split("@")[1].split(".")[0] || "Unknown";
  admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .update({
      company: companyName[0].toUpperCase() + companyName.slice(1),
    });
});
