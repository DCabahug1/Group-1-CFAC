import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useModuleStore, useUserSession } from "../../lib/store";
import { theme } from "../../lib/theme";
import CompletionReport from "../components/CompletionReport";
import LearningCard from "../components/LearningCard";
import TestingView, { LetterProgress } from "../components/TestingView";
import { letterTips } from "../lib/letterTips";
import { modulesList } from "../lib/modules";

type Mode = "learning" | "testing" | "complete";

export default function ModuleDetail() {
  const { id } = useLocalSearchParams();
  const moduleId = Array.isArray(id) ? id[0] : id;
  const module = modulesList.find((m) => m.id === Number(moduleId));
  const userId = useUserSession((state) => state.userId);

  const [mode, setMode] = useState<Mode>("learning");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [letterProgress, setLetterProgress] = useState<LetterProgress[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalTries, setTotalTries] = useState(0);

  // Initialize letter progress
  useEffect(() => {
    if (module) {
      const initialProgress: LetterProgress[] = module.letter_set.map(
        (letter) => ({
          letter,
          status: "pending",
          attempts: 0,
        }),
      );
      setLetterProgress(initialProgress);
    }
  }, [module]);

  if (!module) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Module not found</Text>
      </View>
    );
  }

  const currentLetter = module.letter_set[currentLetterIndex];
  const currentTip =
    letterTips[currentLetter] || "Practice this sign carefully";

  // Learning mode handlers
  const handleNext = () => {
    if (currentLetterIndex < module.letter_set.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    }
  };

  const handleStartQuiz = () => {
    setMode("testing");
    setCurrentLetterIndex(0);
    setStartTime(new Date());
  };

  // Testing mode handler
  const handleLetterComplete = (isCorrect: boolean) => {
    const currentProgress = letterProgress[currentLetterIndex];
    const newAttempts = currentProgress.attempts + 1;
    setTotalTries(totalTries + 1);

    let newStatus: LetterProgress["status"];
    if (isCorrect) {
      newStatus = newAttempts === 1 ? "correct" : "second-chance";
    } else if (newAttempts >= 2) {
      newStatus = "failed";
    } else {
      newStatus = "pending";
    }

    // Update progress
    const updatedProgress = [...letterProgress];
    updatedProgress[currentLetterIndex] = {
      ...currentProgress,
      attempts: newAttempts,
      status: newStatus,
    };
    setLetterProgress(updatedProgress);

    // Move to next letter or complete
    if (newStatus !== "pending") {
      if (currentLetterIndex < module.letter_set.length - 1) {
        setTimeout(() => setCurrentLetterIndex(currentLetterIndex + 1), 1000);
      } else {
        setTimeout(() => setMode("complete"), 1000);
      }
    }
  };

  // Completion calculations
  const calculateStats = () => {
    const correctCount = letterProgress.filter(
      (p) => p.status === "correct" || p.status === "second-chance",
    ).length;
    const accuracy = Math.round(
      (correctCount / module.letter_set.length) * 100,
    );

    const timeSpent = startTime
      ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      : 0;

    let stars = 1;
    if (accuracy >= 100) stars = 5;
    else if (accuracy >= 80) stars = 4;
    else if (accuracy >= 60) stars = 3;
    else if (accuracy >= 40) stars = 2;

    return { accuracy, timeSpent, stars };
  };

  const handleTryAgain = () => {
    setMode("learning");
    setCurrentLetterIndex(0);
    setLetterProgress(
      module.letter_set.map((letter) => ({
        letter,
        status: "pending",
        attempts: 0,
      })),
    );
    setTotalTries(0);
    setStartTime(null);
  };

  const handleContinue = () => {
    const { accuracy } = calculateStats();

    // Mark module as complete if all letters are correct
    if (accuracy == 100) {
      useModuleStore.getState().completeModule(module.id, accuracy);
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{module.title}</Text>
      </View>

      {/* Content based on mode */}
      <View style={styles.content}>
        {mode === "learning" && (
          <LearningCard
            letter={currentLetter}
            tip={currentTip}
            currentIndex={currentLetterIndex}
            totalLetters={module.letter_set.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {mode === "testing" && userId && (
          <TestingView
            currentLetter={currentLetter}
            letterProgress={letterProgress}
            onLetterComplete={handleLetterComplete}
            userId={userId}
            moduleId={module.id}
          />
        )}

        {mode === "complete" && (
          <CompletionReport
            {...calculateStats()}
            totalTries={totalTries}
            onTryAgain={handleTryAgain}
            onContinue={handleContinue}
          />
        )}
      </View>
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
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Balance the back button
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 100,
  },
});
