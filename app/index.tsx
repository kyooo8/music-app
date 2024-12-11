import { Redirect, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

import { auth } from "@/firebase/firebaseConfig";

export default function Index() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        router.replace("/list");
      }
    });
  }, []);
  return <Redirect href={"/(auth)/login"} />;
}
