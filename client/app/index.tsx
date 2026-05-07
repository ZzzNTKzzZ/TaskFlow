import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";

import { Redirect } from "expo-router";

export default function App() {
  const user = useCurrentUser();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}