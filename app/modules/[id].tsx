import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";
import { modulesList } from "../lib/modules";

export default function ModuleDetail() {
  const { id } = useLocalSearchParams();
  const moduleId = Array.isArray(id) ? id[0] : id;
  const module = modulesList.find((m) => m.id === Number(moduleId));

  if (!module) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Module not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{module.title}</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.description}>{module.description}</Text>

        {/* Placeholder for lesson content */}
        <View style={styles.lessonPlaceholder}>
          <Text style={styles.placeholderText}>
            Lesson content will go here
          </Text>
          <Text style={styles.placeholderSubtext}>
            This is where you'll add the ASL camera component and lesson
            activities
          </Text>
        </View>

        {/* Complete Button */}
        <Pressable
          style={styles.completeButton}
          onPress={() => {
            // TODO: Mark module as complete and navigate back
            router.back();
          }}
        >
          <Text style={styles.completeButtonText}>Complete Lesson</Text>
        </Pressable>
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
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  description: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 32,
    lineHeight: 26,
  },
  lessonPlaceholder: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 40,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.white,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 100,
  },
});
