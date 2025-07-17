import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  background: "#e6f0ff",
  cardBg: "#f0f4ff",
  border: "#ffffff",
  icon: "#2b3d5b",
  label: "#001D39",
  shine: "rgba(255,255,255,0.6)",
  shadow: "rgba(0, 0, 0, 0.15)",
};

const investOptions = [
  { label: "Stocks", icon: "chart-line" },
  { label: "FDs", icon: "university" },
  { label: "Gold", icon: "coins" },
  { label: "Silver", icon: "medal" },
  { label: "Interest", icon: "percentage" },
  { label: "Loan", icon: "hand-holding-usd" },
  { label: "Rates", icon: "chart-bar" },
  { label: "Mutuals", icon: "project-diagram" },
];

const InvestGrid = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Where do you want to invest?</Text>
      <View style={styles.grid}>
        {investOptions.map((item, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={index * 80}
            useNativeDriver
            style={styles.cardWrapper}
          >
            <TouchableOpacity style={styles.card}>
              <LinearGradient
                colors={["#ffffff90", "#ffffff00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shineOverlay}
              />
              <FontAwesome5 name={item.icon} size={22} color={COLORS.icon} />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );
};

export default InvestGrid;

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.label,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "23%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",

    borderColor: COLORS.border,
    borderWidth: 1.5,

    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  shineOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    zIndex: 1,
  },
  label: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.label,
    zIndex: 2,
  },
});
