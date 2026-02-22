import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";
import MasteryCircle from "../components/MasteryCircle";
import MotivationalBanner from "../components/MotivationalBanner";
import StatsCard from "../components/StatsCard";

export default function Insights() {
  // Placeholder data - will be replaced with real data from Supabase
  const vocabularyPercentage = 0;
  const vocabularyCount = 0;
  const totalLessons = 37;
  const avgAccuracy = 0;
  const masteryPercentage = 0;
  const streak = 67;

  // Difficulty breakdown
  const beginnerCompleted = 0;
  const beginnerTotal = 10;
  const intermediateCompleted = 0;
  const intermediateTotal = 15;
  const advancedCompleted = 0;
  const advancedTotal = 12;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>ASLingo</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{streak}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Motivational Banner */}
        <MotivationalBanner />
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatsCard
            icon="🎯"
            label="Vocabulary"
            value={`${vocabularyPercentage}%`}
            subtitle={`${vocabularyCount} of ${totalLessons} lessons`}
          />
          <StatsCard
            icon="📈"
            label="Avg Accuracy"
            value={`${avgAccuracy}%`}
            subtitle="Across all lessons"
            valueColor="#22C55E"
          />
        </View>

        {/* Mastery Circle */}
        <MasteryCircle
          percentage={masteryPercentage}
          beginnerCount={beginnerCompleted}
          beginnerTotal={beginnerTotal}
          intermediateCount={intermediateCompleted}
          intermediateTotal={intermediateTotal}
          advancedCount={advancedCompleted}
          advancedTotal={advancedTotal}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
});
