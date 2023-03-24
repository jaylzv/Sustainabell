import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { midnightTimestamp } from "../utils";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

const getErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email";
      break;
    case "auth/wrong-password":
      return "Wrong password";
      break;
    case "auth/user-not-found":
      return "User not found";
      break;
    case "auth/network-request-failed":
      return "Please check your network connection. You might be offline";
      break;
    case "auth/too-many-requests":
      return "Too many requests";
      break;
    case "auth/user-disabled":
      return "This user account is disabled. Please contact an administrator";
      break;
    default:
      return errorCode;
  }
};

const useProvideAuth = () => {
  const [user, setUser] = useState<AuthContextInterface["user"]>();
  const [error, setError] = useState<AuthContextInterface["error"]>("");
  const [loading, setLoading] = useState(true);

  const signin: AuthContextInterface["signin"] = async (password, email) => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        setError(getErrorMessage(e.code));
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const signup: AuthContextInterface["signup"] = async (
    email,
    password,
    userData
  ) => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      setError("");
      setDoc(doc(db, "users", user.user.uid), {
        ...userData,
        points: 0,
      });
      setDoc(doc(collection(db, "users", user.user.uid, "history")), {
        points: 0,
        timestamp: midnightTimestamp,
      });
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        setError(getErrorMessage(e.code));
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const signout: AuthContextInterface["signout"] = async () => {
    setLoading(true);
    await auth.signOut();
    setLoading(false);
  };

  // const changePassword: AuthContextInterface["changePassword"] = async (
  //   newPassword
  // ) => {
  //   if (!auth.currentUser) return;
  //   setLoading(true);
  //   try {
  //     await updatePassword(auth.currentUser, newPassword);
  //     Alert.alert("Password changed!");
  //   } catch (e: unknown) {
  //     let errorMessage = "Error: ";
  //     if (e instanceof FirebaseError) {
  //       if (e.code === "auth/requires-recent-login") {
  //         Alert.prompt(
  //           "Confirm access",
  //           "Please enter your old password",
  //           (oldPassword) => {
  //             signInWithEmailAndPassword(
  //               auth,
  //               auth.currentUser?.email!,
  //               oldPassword
  //             )
  //               .then(() => {
  //                 changePassword(newPassword);
  //               })
  //               .catch((e: FirebaseError) => {
  //                 setLoading(false);
  //                 Alert.alert("Error: ", e.message.replace("Firebase: ", " "));
  //               });
  //           },
  //           "login-password"
  //         );
  //         return;
  //       }
  //       errorMessage += e.message.replace("Firebase:", " ");
  //     } else {
  //       errorMessage += "something went wrong :(";
  //     }
  //     Alert.alert(errorMessage);
  //   }
  //   setLoading(false);
  // };

  //   const sendPasswordResetEmail = (email) => {
  //     return firebase
  //       .auth()
  //       .sendPasswordResetEmail(email)
  //       .then(() => {
  //         return true;
  //       });
  //   };
  //   const confirmPasswordReset = (code, password) => {
  //     return firebase
  //       .auth()
  //       .confirmPasswordReset(code, password)
  //       .then(() => {
  //         return true;
  //       });
  //   };
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(
        db,
        "users",
        user?.uid!,
        "history",
        midnightTimestamp().seconds.toString()
      ),
      (doc) => {
        getDocs(collection(db, "users", user?.uid!, "history")).then(
          (querySnapshot) => {
            let streak = 0;
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.points && data.points > 0) {
                streak++;
              }
            });
            const data = doc.data();
            setUser({
              ...user,
              ...data,
              points: data?.points || 0,
              streak,
            });
            setLoading(false);
          }
        );
      }
    );
    return unsubscribe;
  }, [user?.uid]);

  return {
    loading,
    error,
    user,
    signin,
    signup,
    signout,
    // changePassword,
    // sendPasswordResetEmail,
    // confirmPasswordReset,
  };
};

interface AuthContextInterface {
  loading: boolean;
  error: string;
  user?: Partial<User & { points: number; streak: number }> | null;
  signin: (password: string, email: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string }
  ) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface>(undefined as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authHook = useProvideAuth();
  return (
    <AuthContext.Provider value={authHook}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
