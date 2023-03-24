import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { LatLng } from "react-native-maps/lib/sharedTypes";
import { LongPressEvent } from "react-native-maps/lib/MapView.types";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export const AddQuestion = () => {
  const [numberOfAnswers, setNumberOfAnswers] = useState(1);
  const { user } = useAuth();
  const [status, requestPermission] = Location.useBackgroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const [currentMarker, setCurrentMarker] = useState<{
    LatLng?: LatLng;
    question?: string;
    answers?: {
      text: string;
      points: string;
    }[];
  }>();

  const createGeoQuestion = async () => {
    if (!currentMarker?.LatLng) {
      Alert.alert("Please add a marker on the map");
      return;
    }
    if (!currentMarker?.question) {
      Alert.alert("Please add a question");
      return;
    }
    if (!currentMarker?.answers) {
      Alert.alert("Please add answers");
      return;
    }
    setLoading(true);
    await setDoc(doc(collection(db, "geoQuestions")), {
      ...currentMarker,
      createdBy: user?.uid,
      createdOn: Timestamp.now(),
    });
    setCurrentMarker(undefined);
    setLoading(false);
    Alert.alert("Question created", "", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Home"),
      },
      {
        text: "Add another question",
      },
    ]);
  };

  const addNewMarker = async (e: LongPressEvent) => {
    setCurrentMarker({ ...currentMarker, LatLng: e.nativeEvent.coordinate });
    // setMarkers([...markers, e.nativeEvent.coordinate]);
    // setMarkers([...markers, { ...e.nativeEvent.coordinate, question }]);
  };

  useEffect(() => {
    let locationSubscrition: Location.LocationSubscription | undefined;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // let location = await Location.getCurrentPositionAsync({});
      // setLocation(location);

      locationSubscrition = await Location.watchPositionAsync(
        {
          // Tracking options
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 5,
        },
        (location) => {
          /* Location object example:
            {
              coords: {
                accuracy: 20.100000381469727,
                altitude: 61.80000305175781,
                altitudeAccuracy: 1.3333333730697632,
                heading: 288.87445068359375,
                latitude: 36.7384213,
                longitude: 3.3463877,
                speed: 0.051263172179460526,
              },
              mocked: false,
              timestamp: 1640286855545,
            };
          */
          // Do something with location...
          setLocation(location);
        }
      );
    })();

    return () => {
      if (locationSubscrition) {
        locationSubscrition.remove();
      }
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView
        style={{ width: "100%", height: 400 }}
        region={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.00162,
          longitudeDelta: 0.000521,
        }}
        showsUserLocation={true}
        loadingEnabled={true}
        onLongPress={addNewMarker}
      >
        {/* {markers.map((marker, i) => (
          <Marker
            key={i}
            coordinate={marker}
            title={`Marker ${i + 1}`}
            description="This is a marker"
          />
        ))} */}
        {currentMarker?.LatLng && (
          <Marker
            coordinate={currentMarker.LatLng}
            title={currentMarker.question}
            description={currentMarker.answers?.join(", ")}
          />
        )}
      </MapView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={140}
        style={styles.inputContainer}
      >
        <Text style={styles.title}>
          Add a new question for the selected location
        </Text>
        <TextInput
          mode="outlined"
          label="Question"
          value={currentMarker?.question}
          onChangeText={(question) =>
            setCurrentMarker({ ...currentMarker, question })
          }
          style={[styles.input, { minHeight: 100 }]}
          multiline
          numberOfLines={3}
          disabled={!currentMarker?.LatLng}
        />

        {Array.from(Array(numberOfAnswers).keys()).map((i) => (
          <View key={i}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TextInput
                mode="outlined"
                label={`Answer ${i + 1}`}
                value={
                  (currentMarker?.answers || [])[
                    i as keyof typeof currentMarker
                  ]?.text
                }
                onChangeText={(text) => {
                  const answers = currentMarker?.answers || [];
                  answers[i as any] = {
                    text,
                    points: answers[i as any]?.points,
                  };
                  return setCurrentMarker({
                    ...currentMarker,
                    answers,
                  });
                }}
                style={[styles.input, { flex: 0.75 }]}
                disabled={!currentMarker?.LatLng}
              />
              <TextInput
                mode="outlined"
                label="Points"
                value={
                  (currentMarker?.answers || [])[
                    i as keyof typeof currentMarker
                  ]?.points
                }
                keyboardType="numeric"
                onChangeText={(points) => {
                  const answers = currentMarker?.answers || [];
                  answers[i as any] = {
                    text: answers[i as any]?.text,
                    points,
                  };
                  return setCurrentMarker({
                    ...currentMarker,
                    answers,
                  });
                }}
                style={[styles.input, { flex: 0.25, marginLeft: 8 }]}
                disabled={!currentMarker?.LatLng}
              />
            </View>
            {i === numberOfAnswers - 1 && (
              <>
                <Button
                  style={{ marginBottom: 48, marginTop: 24 }}
                  onPress={() => setNumberOfAnswers((a) => a + 1)}
                  disabled={!currentMarker?.LatLng}
                >
                  Add Answer
                </Button>

                <Button
                  onPress={createGeoQuestion}
                  mode="contained"
                  loading={loading}
                >
                  Save!
                </Button>
              </>
            )}
          </View>
        ))}
      </KeyboardAvoidingView>
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
  inputContainer: {
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
  },
  input: {
    // width: "100%",
    flex: 1,
    maxWidth: 400,
    marginVertical: 10,
  },
});
