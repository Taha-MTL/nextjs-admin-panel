"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Loader from "@/components/Loader/FullPage";
import { useRouter } from "next/navigation";
import UserData from "@/interface/userData.interface";

interface UserContextType {
  user: UserData | null;
  setUser: Dispatch<SetStateAction<UserData | null>>;
}

const publicRoutes = ["/auth/signin"];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const currentPath = window.location.pathname;

      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserData);
        } else {
          const data = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: "Admin",
            username: "Admin",
          };
          await setDoc(doc(db, "users", firebaseUser.uid), data);
          setUser(data as UserData);
        }
        if (currentPath === "/auth/signin") router.push("/");
      } else {
        setUser(null);
        if (!publicRoutes.includes(currentPath)) router.push("/auth/signin");
      }

      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
};
