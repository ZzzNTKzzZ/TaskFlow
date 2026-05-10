import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { Image, StyleSheet, View } from "react-native";

export default function Avatar({ size = 42, name }: {size?: number, name?: string}) {
const currentUser = useCurrentUser();

  const displayName = name || currentUser?.name || "User";

  const urlAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&format=png`;
  return (
    <View style={{ width: size, height: size}}>
      <Image
        style={styles.image}
        source={{ uri: urlAvatar }}
        defaultSource={{ uri: "https://ui-avatars.com/api/?name=?" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
});
