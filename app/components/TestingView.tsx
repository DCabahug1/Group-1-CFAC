import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { verifyWithAI } from "../../lib/api-client";
import { theme } from "../../lib/theme";
import { DetectionResult } from "../../lib/types";
import { isLetterAccepted } from "../lib/letterGroups";
import { sendAttemptToDB } from "../lib/proficiency";
import ASLCamera, { ASLCameraRef } from "./ASLCamera";

export type LetterStatus = "pending" | "correct" | "second-chance" | "failed";

export interface LetterProgress {
  letter: string;
  status: LetterStatus;
  attempts: number;
}

interface TestingViewProps {
  currentLetter: string;
  letterProgress: LetterProgress[];
  onLetterComplete: (isCorrect: boolean) => void;
  userId: number;
  moduleId: number;
}

export default function TestingView({
  currentLetter,
  letterProgress,
  onLetterComplete,
  userId,
  moduleId,
}: TestingViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<ASLCameraRef>(null);

  const handleDetection = async (result: DetectionResult, imageUri: string) => {
    try {
      console.log("Backend result:", result);

      // Extract just the letter from the result (e.g., "ASL_A" -> "A")
      let detectedLetter = result.sign.replace("ASL_", "");

      if (!detectedLetter && !result.success) {
        console.error("Detection failed:", result);
        setIsProcessing(false);
        return; // Skip processing if detection failed
      }

      // If we have landmarks, verify with AI
      if (result.landmarks && imageUri) {
        console.log("Verifying with AI...");
        const aiResult = await verifyWithAI(
          imageUri,
          result.landmarks,
          detectedLetter,
        );

        if (aiResult.success && aiResult.letter) {
          console.log(
            `AI verification: ${aiResult.letter} (model: ${detectedLetter})`,
          );
          // Trust AI result
          detectedLetter = aiResult.letter;
        } else {
          console.log("AI verification failed, using model result");
        }
      }

      // Check if detected letter is in the acceptable group for the expected letter
      const isCorrect =
        result.success && isLetterAccepted(currentLetter, detectedLetter);

      console.log("Detection result:", {
        detectedLetter,
        currentLetter,
        isCorrect,
        acceptedSimilar: detectedLetter !== currentLetter && isCorrect,
      });

      // Get current attempt number (before increment)
      const currentProgress = letterProgress.find(
        (p) => p.letter === currentLetter,
      );
      const attemptNumber = (currentProgress?.attempts || 0) + 1;

      // Log attempt to database
      const success = await sendAttemptToDB({
        userId,
        moduleId,
        letter: currentLetter,
        isCorrect,
        detectedLetter,
        attemptNumber,
      });

      if (!success) {
        console.error("Failed to log attempt to database");
      }

      onLetterComplete(isCorrect);
    } finally {
      // Always stop processing, even if there's an error
      setIsProcessing(false);
    }
  };

  const handleCapture = async () => {
    setIsProcessing(true);
    if (cameraRef.current) {
      await cameraRef.current.takePicture();
    }
  };

  const getStatusColor = (status: LetterStatus) => {
    switch (status) {
      case "correct":
        return "#22C55E"; // Green
      case "second-chance":
        return "#EAB308"; // Yellow
      case "failed":
        return "#EF4444"; // Red
      default:
        return "#9CA3AF"; // Gray
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <ASLCamera ref={cameraRef} onDetection={handleDetection} />

        {/* Camera Icon Overlay */}
        <View style={styles.cameraIconOverlay}>
          <View style={styles.cameraIconContainer}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </View>

        {/* Capture Button */}
        <Pressable
          style={[
            styles.captureButton,
            isProcessing && styles.captureButtonDisabled,
          ]}
          onPress={handleCapture}
          disabled={isProcessing}
        >
          <View style={styles.captureButtonInner} />
        </Pressable>

        {/* Loading Overlay */}
        {isProcessing && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Analyzing sign...</Text>
              <Text style={styles.loadingSubtext}>Verifying with AI</Text>
            </View>
          </View>
        )}
      </View>

      {/* Current Letter Display */}
      <View style={styles.letterDisplay}>
        <Text style={styles.currentLetter}>{currentLetter}</Text>
      </View>

      {/* Letter Progress Badges */}
      <View style={styles.progressContainer}>
        {letterProgress.map((item, index) => (
          <View
            key={item.letter}
            style={[
              styles.progressBadge,
              { backgroundColor: getStatusColor(item.status) },
              item.letter === currentLetter && styles.progressBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.progressBadgeText,
                item.status === "pending" && styles.progressBadgeTextPending,
              ]}
            >
              {item.letter}
            </Text>
          </View>
        ))}
      </View>

      {isProcessing && (
        <View style={styles.processingOverlay}>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  cameraIconOverlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cameraIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 32,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    borderWidth: 3,
    borderColor: "#000",
  },
  letterDisplay: {
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    borderRadius: theme.borderRadius.lg,
  },
  currentLetter: {
    fontSize: 48,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  progressBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBadgeActive: {
    borderWidth: 3,
    borderColor: theme.colors.textPrimary,
  },
  progressBadgeText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.white,
  },
  progressBadgeTextPending: {
    color: "#4B5563",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    marginTop: 10,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 32,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  loadingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
