import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import * as SecureStore from "expo-secure-store"
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function App() {
  const user = useCurrentUser();
  
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("ACCESS_TOKEN")
        if(token) {
          setAccessToken(token)
        }
      } catch (error) {
        console.log("Not found token")
      }
    }
    restoreToken() 
  }, [user])
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}