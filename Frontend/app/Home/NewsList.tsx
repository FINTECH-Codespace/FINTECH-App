import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";

const COLORS = {
  primary: "#001D39",
  gray: "#0A4174",
  background: "#F2F6FB",
  card: "#F8FAFD",
  shadowLight: "#DDE7F2",
};

const newsItems = [
  {
    id: "1",
    title: "RBI maintains repo rate",
    desc: "The Reserve Bank of India keeps the key rates steady.",
    meta: "Screener • 2 hours ago",
    image: "https://via.placeholder.com/80x80?text=RBI",
  },
  {
    id: "2",
    title: "SEBI introduces new norms",
    desc: "SEBI introduces new rules for market transparency.",
    meta: "AMFI • Yesterday",
    image: "https://via.placeholder.com/80x80?text=SEBI",
  },
];

const NewsList = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.newsHeading}>News & Advisories</Text>
      <FlatList
        data={newsItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            delay={index * 100}
            useNativeDriver
          >
            <TouchableOpacity style={styles.newsCard}>
              <Image source={{ uri: item.image }} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsDesc}>{item.desc}</Text>
                <Text style={styles.newsMeta}>{item.meta}</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />
    </View>
  );
};

export default NewsList;

const styles = StyleSheet.create({
  newsHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: 16,
  },
  newsCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  newsImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
    color: COLORS.primary,
  },
  newsDesc: {
    fontSize: 13,
    color: COLORS.gray,
  },
  newsMeta: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
  },
});
