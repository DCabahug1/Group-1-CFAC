import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { detectSign } from "../lib/api-client";
import { DetectionResult } from "../lib/types";

interface ASLCameraProps {
  onDetection: (result: DetectionResult) => void; // Sends result to parent component
}

function ASLCamera({ onDetection }: ASLCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false); // To track if awaiting response from backend
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current && !isDetecting) {
      try {
        setIsDetecting(true);
        const { uri: photoUri } = await cameraRef.current.takePictureAsync(); // Waits for photo to be taken

        console.log("photoUri:", photoUri);

        const result = await detectSign(photoUri);
        onDetection(result); // Send result to parent component
      } catch (error) {
        console.error("Error taking picture:", error);
        onDetection({
          success: false,
          sign: "",
          confidence: 0,
          error: "Failed to capture or process image",
        });
      } finally {
        setIsDetecting(false);
      }
    }
  };

  if (!permission) {
    return null;
  } else if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permission not granted</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      {isDetecting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Detecting sign...</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={takePicture}
        style={[
          styles.captureButton,
          isDetecting && styles.captureButtonDisabled,
        ]}
        disabled={isDetecting}
      >
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default ASLCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 100,
  },
  captureButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.5,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
  },
});
