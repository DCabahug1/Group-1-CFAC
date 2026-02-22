import { CameraView, useCameraPermissions } from "expo-camera";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { detectSign } from "../lib/api-client";
import { DetectionResult } from "../lib/types";

interface ASLCameraProps {
  onDetection: (result: DetectionResult, imageUri: string) => void;
}

export interface ASLCameraRef {
  takePicture: () => Promise<void>;
}

const ASLCamera = forwardRef<ASLCameraRef, ASLCameraProps>(
  ({ onDetection }, ref) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [isDetecting, setIsDetecting] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    const takePicture = async () => {
      if (cameraRef.current && !isDetecting) {
        setIsDetecting(true);
        try {
          const { uri: photoUri } = await cameraRef.current.takePictureAsync();
          const result = await detectSign(photoUri);

          console.log("photoUri:", photoUri);

          onDetection(result, photoUri);
        } catch (error) {
          console.error("Error taking picture:", error);
          onDetection(
            {
              success: false,
              sign: "",
              confidence: 0,
            },
            "",
          );
        } finally {
          setIsDetecting(false);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      takePicture,
    }));

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
        {/* <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity> */}
      </View>
    );
  },
);

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
