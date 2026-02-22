import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  valueColor?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  subtitle,
  valueColor = theme.colors.textPrimary,
}: StatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  value: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
