import React from "react";
import { StyleSheet, View } from "react-native";
import { DetectionResult } from "../lib/types";
import ASLCamera from "./components/ASLCamera";

function ASLMode() {
  const handleDetection = (result: DetectionResult) => {
    console.log(result);
  };

  return (
    <View style={styles.container}>
      <ASLCamera onDetection={handleDetection} />
    </View>
  );
}

export default ASLMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
