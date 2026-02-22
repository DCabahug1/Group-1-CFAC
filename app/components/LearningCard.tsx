import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";

interface LearningCardProps {
  letter: string;
  tip: string;
  currentIndex: number;
  totalLetters: number;
  onNext: () => void;
  onPrevious: () => void;
  onStartQuiz: () => void;
}

export default function LearningCard({
  letter,
  tip,
  currentIndex,
  totalLetters,
  onNext,
  onPrevious,
  onStartQuiz,
}: LearningCardProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalLetters - 1;

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {Array.from({ length: totalLetters }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Letter Card */}
      <View style={styles.card}>
        {/* Placeholder Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>✋</Text>
          </View>
        </View>

        {/* Letter Name */}
        <Text style={styles.letterName}>{letter}</Text>

        {/* Letter Count Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Letter {currentIndex + 1} of {totalLetters}
          </Text>
        </View>
      </View>

      {/* Tip Box */}
      <View style={styles.tipBox}>
        <Text style={styles.tipLabel}>💡 Tip:</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {!isFirst && (
          <Pressable style={styles.secondaryButton} onPress={onPrevious}>
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </Pressable>
        )}
        {!isLast ? (
          <Pressable style={styles.primaryButton} onPress={onNext}>
            <Text style={styles.primaryButtonText}>Next Sign</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={onStartQuiz}>
            <Text style={styles.primaryButtonText}>Quiz Me</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotInactive: {
    backgroundColor: "#D1D5DB",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  letterName: {
    fontSize: 64,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  tipBox: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 32,
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
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.full,
    flex: 1,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.full,
    flex: 1,
    maxWidth: 150,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
