import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { detectSign } from "../lib/api-client";
import { DetectionResult } from "../lib/types";
import {Ionicons} from '@expo/vector-icons'

interface ASLCameraProps {
  onDetection: (result: DetectionResult) => void; // Sends result to parent component
}

function ASLCamera({ onDetection }: ASLCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false); // To track if awaiting response from backend
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri: photoUri } = await cameraRef.current.takePictureAsync(); // Waits for photo to be taken
      const result = await detectSign(photoUri);

      console.log("photoUri:", photoUri)

      onDetection(result); // Send result to parent component
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
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
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
});
