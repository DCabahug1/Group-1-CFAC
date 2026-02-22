import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";

interface MotivationalBannerProps {
  title?: string;
  message?: string;
}

export default function MotivationalBanner({
  title = "⭐ Keep It Up!",
  message = "Small signs every day lead to big conversations",
}: MotivationalBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.white,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: theme.colors.white,
    opacity: 0.9,
    lineHeight: 20,
  },
});
