import { Text, TouchableOpacity, View } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { useEffect } from "react";
import { Colors } from "@/theme/colors";

export default function Pagination({
  page,
  setPage,
  totalPage,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
}) {

    const handleNext = () => {
        if(page < totalPage) {
            setPage(page + 1)
        }
        if(page === totalPage) return
    }

    const handlePrev = () => {
        if(page > 0) {
            setPage(page - 1)
        }
        if(page === 1) return
    }
    const handleCurrentPage = (pageSelect: number) => {
        setPage(pageSelect)
    }
  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing[2],
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          backgroundColor: Theme.surface,
          borderRadius: 8,
          padding: Spacing[2],
          borderWidth: 1,
          borderColor: Theme.border,
        }}
        onPress={handlePrev}
      >
        <LeftRightIcon direction="left" size={20} />
      </TouchableOpacity>
        {[...Array(totalPage)].map((_, index) => (
            <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => handleCurrentPage(index + 1)}
             style={{
                padding: Spacing[2],
                aspectRatio: 1,
                borderRadius: 8,
                backgroundColor: index  === page - 1 ? Colors.primary[100] : undefined
            }}>
                <Text style={[Typography.title ,{textAlign: "center", fontSize: 16, color: index === page - 1? Colors.primary[600] :Theme.textSecondary}]} key={index}>{index + 1}</Text>
            </TouchableOpacity>
      ))}
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          backgroundColor: Theme.surface,
          borderRadius: 8,
          padding: Spacing[2],
          borderWidth: 1,
          borderColor: Theme.border,
        }}
        onPress={handleNext}
      >
        <LeftRightIcon direction="right" size={20} />
      </TouchableOpacity>
    </View>
  );
}
