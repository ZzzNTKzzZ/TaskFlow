import { RefObject, useCallback } from "react";
import { GestureResponderEvent, View } from "react-native";

export const useClickOutside = (
  ref: RefObject<View | null>,
  callback: () => void,
  isOpen: boolean
) => {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (!isOpen || !ref.current) return;

      ref.current.measure((_, __, width, height, pageX, pageY) => {
        const { pageX: touchX, pageY: touchY } = event.nativeEvent;

        const isOutside =
          touchX < pageX ||
          touchX > pageX + width ||
          touchY < pageY ||
          touchY > pageY + height;

        if (isOutside) {
          callback();
        }
      });
    },
    [ref, callback, isOpen]
  );

  return handlePress;
};