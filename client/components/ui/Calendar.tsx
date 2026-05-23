import { Theme } from "@/theme/theme";
import React from "react";
import { View } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";

type CalendarProps = {
  value: string;
  setValue: (value: string) => void;
};

export default function Calendar({
  value,
  setValue,
}: CalendarProps) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <RNCalendar
        onDayPress={(day) => {
          setValue(day.dateString);
        }}
        markedDates={{
          [value]: {
            selected: true,
            selectedColor: Theme.primary,
          },
        }}
      />
    </View>
  );
}