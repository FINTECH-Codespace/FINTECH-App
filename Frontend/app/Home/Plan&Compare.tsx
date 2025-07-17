import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#001D39",
  accent: "#6EA2B3",
  gray: "#0A4174",
  background: "#EAF2F8",
  card: "#F4F8FC",
  softShadow: "#D1D9E6",
  darkShadow: "#ffffff",
};

const Card = ({ title, text, buttonText, navigateTo }: any) => {
  const router = useRouter();

  return (
    <View style={styles.cardWrapper}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => router.push(navigateTo)}
      >
        <Text style={styles.cardButtonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Text style={styles.cardLink}>How does this work?</Text>
    </View>
  );
};

const GlassCardList = () => {
  return (
    <View>
      <Card
        title="Build Your Investment Plan"
        text="Learn how to plan your investments effectively."
        buttonText="Start Quiz"
        navigateTo="/Investment"
      />
      <Card
        title="Compare Financial Products"
        text="See returns, rates, and features side by side."
        buttonText="Click to start comparing →"
        navigateTo="/index"
      />
    </View>
  );
};

export default GlassCardList;

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: "#E2EAF3",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 12,

    ...Platform.select({
      ios: {
        shadowColor: COLORS.softShadow,
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
    }),
  },
  cardButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  cardLink: {
    fontSize: 13,
    color: COLORS.accent,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
