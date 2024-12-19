import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { LoginContext } from "@/context/LoginContext";
import { Project } from "@/types/project";

export default function Index() {
  let isSynced = false;
  const { setIsLogin } = useContext(LoginContext);
  const localToFirestorage = async (projects: Project[]) => {
    if (isSynced) return;

    console.log(projects);

    const userUid = auth.currentUser?.uid;
    if (!userUid) return;
    for (const project of projects) {
      await addDoc(collection(db, `users/${userUid}/projects`), { ...project });
    }
    console.log("All local projects are written to Firestore");
    await AsyncStorage.removeItem("projects");

    isSynced = true;
  };
  useEffect(() => {
    console.log("useEffect triggered");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("onAuthStateChanged triggered", user);

      if (user) {
        setIsLogin(true);
        const storedData = await AsyncStorage.getItem("projects");
        console.log("Stored data:", storedData);

        if (storedData) {
          const projects = JSON.parse(storedData) as Project[];
          console.log("Projects to sync:", projects);

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

  return null;
}
