import { Image, Text, View } from "react-native";
import Logo from "../../assets/icons/Logo.svg";
import { globalStyles } from "@/styles/global";
import { Colors, Spacing, Typography } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderProps = {
  userAvatar?: string | null;
};

export default function Header({ userAvatar }: HeaderProps) {
  const defaultUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDtUjEh0gzimrGsiks8D2cn3jpwcXNunNwgLPyCI73-rfO1v6MIHjXsLs_5hQMyA-fWUfX6RJrLWbo96XlUQa-Ljgmjc6D1i3-g0Hj_YAh0YMt67lF-jTMP3rpyy1LGOiLxqLiwNp9T7WbBsg0NdlTZ-ULhVpl5RG4tgLty-nQDc3Q2NLjhv9M4SgrximB2WGcfFi-E2V-vWhy44PNUQf2m3IUuLaYsr5LGvh1MqxEV_jYPOOm5CKWAOfJqKj4Ysncte2RTMsyeGFvw";
  const inset = useSafeAreaInsets()
  return (
    <View
      style={[
        globalStyles.container,
        { 
          paddingTop: inset.top,
          paddingVertical: Spacing.xxl,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <View
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: Spacing.lg,
        }}
      >
        <Logo width={28} height={28}/>
        <Text style={[Typography.displayLg, {color: Colors.primary, marginBottom: Spacing.xs}]}>TaskFlow Pro</Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.primary_T90,
          borderRadius: 12,
          padding: 2,
        }}
      >
        <Image
          source={{ uri: !userAvatar ? defaultUri : userAvatar }}
          style={{ width: 40, height: 40, borderRadius: 10 }}
        />
      </View>
    </View>
  );
}
