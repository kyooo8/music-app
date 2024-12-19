import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { LoginContext } from "@/context/LoginContext";
import { Project } from "@/types/project";
import { View, Image } from "react-native";

export default function Index() {
  let isSynced = false;
  const { setIsLogin } = useContext(LoginContext);
  const localToFirestorage = async (projects: Project[]) => {
    if (isSynced) return;
    const userUid = auth.currentUser?.uid;
    if (!userUid) return;
    for (const project of projects) {
      await addDoc(collection(db, `users/${userUid}/projects`), { ...project });
    }
    await AsyncStorage.removeItem("projects");

    isSynced = true;
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLogin(true);
        const storedData = await AsyncStorage.getItem("projects");
        if (storedData) {
          const projects = JSON.parse(storedData) as Project[];
          if (projects.length > 0) {
            await localToFirestorage(projects);
          }
        }
      } else {
        setIsLogin(false);
      }
      router.replace(`/list`);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Image
      source={require("@/assets/images/splash.png")}
      style={{ width: "100%", height: "100%" }}
    ></Image>
  );
}
