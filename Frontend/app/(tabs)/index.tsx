import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InvestGrid from "../Home/InvestGrid";
import NewsList from "../Home/NewsList";
import GlassCardList from "../Home/Plan&Compare";

const { height } = Dimensions.get("window");
const IMAGE_HEIGHT = height / 2.7;

const COLORS = {
  background: "#E9F2FA",
  lightBox: "#F2F6FB",
  gray: "#A6B6CC",
  primary: "#001D39",
};

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Top Image Section */}
      <Image
        source={require("../../assets/images/fintech_banner.jpg")}
        style={styles.fixedImage}
        resizeMode="cover"
      />

      {/* Scrollable Section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: IMAGE_HEIGHT }}
      >
        <View style={styles.innerContainer}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray} />
            <TextInput
              placeholder="Search for: Mutual funds, Stocks, Gold, etc"
              placeholderTextColor={COLORS.gray}
              style={styles.searchInput}
            />
          </View>

          {/* Investment Options */}
          <InvestGrid />

          {/* Cards and News */}
          <GlassCardList />
          <NewsList />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    marginBottom: -350,
  },
  scrollContainer: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingTop: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightBox,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: COLORS.primary,
  },
});
