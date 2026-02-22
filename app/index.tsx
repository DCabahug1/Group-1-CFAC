import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../lib/theme";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Logo and Tagline */}
      <View style={styles.header}>
        <Text style={styles.logo}>ASLingo</Text>
        <Text style={styles.tagline}>Bridge the gap,</Text>
        <Text style={styles.tagline}>one sign at a time</Text>
      </View>

      {/* Features List */}
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>
            ✨ Interactive camera-based learning
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>🎯 Real-time gesture feedback</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>🎮 Gamified progress tracking</Text>
        </View>
      </View>

      {/* Start Button */}
      <Link href="/(tabs)/modules" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start Learning</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    fontSize: 64,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  features: {
    width: "100%",
    gap: 16,
    marginBottom: 80,
  },
  featureItem: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.lg,
    opacity: 0.85,
  },
  featureText: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: theme.borderRadius.lg,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
