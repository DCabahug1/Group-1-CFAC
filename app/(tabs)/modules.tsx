import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";
import { modulesList, Module } from "../lib/modules";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

function Modules() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("Beginner");
  const [modules, setModules] = useState<Module[]>(modulesList);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>ASLingo</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>67</Text>
        </View>
      </View>

      {/* Difficulty Tabs */}
      <View style={styles.tabsContainer}>
        {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map(
          (difficulty) => (
            <Pressable
              key={difficulty}
              style={[
                styles.tab,
                selectedDifficulty === difficulty && styles.tabActive,
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedDifficulty === difficulty && styles.tabTextActive,
                ]}
              >
                {difficulty}
              </Text>
            </Pressable>
          ),
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {/* TODO: Calculate progress based on completed modules */}
          <View style={[styles.progressFill, { width: `${modules.filter((m) => m.completed).length / modules.length * 100}%` }]} /> 
        </View>
      </View>
      {/* Modules List */}
      <ScrollView
        style={styles.modulesContainer}
        contentContainerStyle={styles.modulesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Module Cards */}
        {modules.map((module) => (
          <Pressable
            key={module.id}
            style={styles.moduleCard}
            onPress={() => {
              // Navigate to module detail
              // Testing: Mark module as completed
              setModules((prevModules) =>
                prevModules.map((m) =>
                  m.id === module.id ? { ...m, completed: true } : m,
                ),
              );
              
            }}
          >
            <View style={styles.moduleContent}>
              <View style={styles.moduleTextContainer}>
                <View style={styles.moduleTitleRow}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  {module.completed && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.moduleDescription}>
                  {module.description}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default Modules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    gap: 8,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  modulesContainer: {
    flex: 1,
  },
  modulesContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
    marginHorizontal: 20
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: theme.borderRadius.sm,
  },
  moduleCard: {
    backgroundColor: "#ffffffff",
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moduleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  moduleDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
