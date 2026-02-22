import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";

interface MasteryCircleProps {
  percentage: number;
  beginnerCount: number;
  beginnerTotal: number;
  intermediateCount: number;
  intermediateTotal: number;
  advancedCount: number;
  advancedTotal: number;
}

export default function MasteryCircle({
  percentage,
  beginnerCount,
  beginnerTotal,
  intermediateCount,
  intermediateTotal,
  advancedCount,
  advancedTotal,
}: MasteryCircleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ASL Mastery</Text>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.completeText}>Complete</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${percentage}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Difficulty Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.difficultyRow}>
          <Text style={styles.difficultyLabel}>Beginner</Text>
          <Text style={styles.difficultyCount}>
            {beginnerCount}/{beginnerTotal}
          </Text>
        </View>
        <View style={styles.difficultyRow}>
          <Text style={styles.difficultyLabel}>Intermediate</Text>
          <Text style={styles.difficultyCount}>
            {intermediateCount}/{intermediateTotal}
          </Text>
        </View>
        <View style={styles.difficultyRow}>
          <Text style={styles.difficultyLabel}>Advanced</Text>
          <Text style={styles.difficultyCount}>
            {advancedCount}/{advancedTotal}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 24,
  },
  progressSection: {
    alignItems: "center",
    marginBottom: 32,

  },
  percentageText: {
    fontSize: 48,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  completeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  breakdown: {
    gap: 16,
  },
  difficultyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyLabel: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  difficultyCount: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
