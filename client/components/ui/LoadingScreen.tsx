import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '@/theme/colors';
import { Theme } from '@/theme/theme';
import { Typography } from '@/theme/typography';
import { Spacing } from '@/theme/spacing';

export default function LoadingScreen({ message = "Đang tải dữ liệu..." }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
  },
  text: {
    ...Typography.body,
    marginTop: Spacing[4],
    color: Colors.gray[600],
  }
});
