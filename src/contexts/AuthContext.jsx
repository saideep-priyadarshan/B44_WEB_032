import { useState, useEffect } from "react";
import { AuthContext } from "./authContxtDef";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeDb = null;
    if (currentUser) {
      const userRef = ref(db, `users/${currentUser.uid}`);
      unsubscribeDb = onValue(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            setUserData({ email: currentUser.email });
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      );
    } else {
      setUserData(null);
    }

    return () => {
      if (unsubscribeDb) {
        unsubscribeDb();
      }
    };
  }, [currentUser]);

  const value = {
    currentUser,
    userData,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
