import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useModuleStore, useUserSession } from "../../lib/store";
import { theme } from "../../lib/theme";
import MasteryCircle from "../components/MasteryCircle";
import MotivationalBanner from "../components/MotivationalBanner";
import StatsCard from "../components/StatsCard";
import { calculateInsights, fetchUserAttempts } from "../lib/proficiency";

export default function Insights() {
  const userId = useUserSession((state) => state.userId);
  const modules = useModuleStore((state) => state.modules);

  const [loading, setLoading] = useState(true);
  const [vocabularyPercentage, setVocabularyPercentage] = useState(0);
  const [vocabularyCount, setVocabularyCount] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState(0);
  const [totalTries, setTotalTries] = useState(0);

  const totalLessons = 26; // Total unique letters in alphabet
  const streak = 67; // Placeholder for now

  // Calculate module completion stats
  const completedModules = modules.filter((m) => m.completed);
  const masteryPercentage = Math.round(
    (completedModules.length / modules.length) * 100,
  );

  // Difficulty breakdown (assuming modules 1-5 are beginner, etc.)
  const beginnerModules = modules.slice(0, 5);
  const intermediateModules = modules.slice(5, 7);
  const advancedModules = modules.slice(7, 9);

  const beginnerCompleted = beginnerModules.filter((m) => m.completed).length;
  const beginnerTotal = beginnerModules.length;
  const intermediateCompleted = intermediateModules.filter(
    (m) => m.completed,
  ).length;
  const intermediateTotal = intermediateModules.length;
  const advancedCompleted = advancedModules.filter((m) => m.completed).length;
  const advancedTotal = advancedModules.length;

  // Fetch and calculate insights every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      const loadInsights = async () => {
        if (!userId) {
          console.log("No userId available yet");
          setLoading(false);
          return;
        }

        console.log("Loading insights for userId:", userId);
        setLoading(true);
        const { data, error } = await fetchUserAttempts(userId);

        if (error || !data) {
          console.error("Failed to load insights:", error);
          setLoading(false);
          return;
        }

        const insights = calculateInsights(data);

        console.log("Fetched attempts:", data.length);
        console.log("Calculated insights:", insights);

        setVocabularyPercentage(insights.vocabularyPercentage);
        setVocabularyCount(insights.vocabularyCount);
        setAvgAccuracy(insights.avgAccuracy);
        setTotalTries(insights.totalTries);
        setLoading(false);
      };

      loadInsights();
    }, [userId]),
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading insights...</Text>
      </View>
    );
  }

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
            subtitle={`${vocabularyCount} of ${totalLessons} letters`}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
