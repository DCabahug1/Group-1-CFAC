import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";

interface CompletionReportProps {
  accuracy: number;
  totalTries: number;
  timeSpent: number; // in seconds
  stars: number;
  onTryAgain: () => void;
  onContinue: () => void;
}

export default function CompletionReport({
  accuracy,
  totalTries,
  timeSpent,
  stars,
  onTryAgain,
  onContinue,
}: CompletionReportProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`;
  };

  const generateTip = () => {
    if (accuracy >= 80) {
      return "Great job! You're mastering ASL signs quickly!";
    } else if (accuracy >= 60) {
      return "Good progress! Focus on hand positioning for better accuracy.";
    } else {
      return "Keep practicing! Pay attention to finger placement and hand orientation.";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Progress Report</Text>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Text key={index} style={styles.star}>
              {index < stars ? "⭐" : "☆"}
            </Text>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Overall Accuracy</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Tries</Text>
            <Text style={styles.statValue}>{totalTries}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Time Spent</Text>
            <Text style={styles.statValue}>{formatTime(timeSpent)}</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipBox}>
          <Text style={styles.tipLabel}>💡 Tips:</Text>
          <Text style={styles.tipText}>{generateTip()}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.secondaryButton} onPress={onTryAgain}>
          <Text style={styles.secondaryButtonText}>Try Again</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  star: {
    fontSize: 40,
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: "#E0E7FF",
    padding: 16,
    borderRadius: theme.borderRadius.md,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  tipBox: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: theme.borderRadius.md,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.full,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.white,
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.full,
    flex: 1,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
