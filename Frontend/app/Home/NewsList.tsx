import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";

const COLORS = {
  primary: "#001D39",
  accent: "#6EA2B3",
  gray: "#0A4174",
  background: "#EAF2F8",
  card: "#F4F8FC",
  softShadow: "#D1D9E6",
  darkShadow: "#ffffff",
};

const NewsList = () => {
  const [news, setNews] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http:// 192.168.134.93:8000/home/news/")
      .then((res) => res.json())
      .then((json) => setNews(json.articles || []))
      .catch((err) => console.error("Failed to fetch news:", err))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handlePressNews = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        Alert.alert("Unable to open link", err.message)
      );
    } else {
      Alert.alert("No URL found for this article.");
    }
  };

  const visibleNews = news.slice(0, visibleCount);

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.newsHeading}>News & Advisories</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          <FlatList
            data={visibleNews}
            keyExtractor={(item, index) => item.url + index}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item, index }) => (
              <Animatable.View
                animation="fadeInUp"
                delay={index * 120}
                useNativeDriver
              >
                <TouchableOpacity
                  style={styles.newsCard}
                  onPress={() => handlePressNews(item.url)}
                >
                  <Image
                    source={{
                      uri:
                        item.urlToImage ||
                        "https://via.placeholder.com/64x64?text=News",
                    }}
                    style={styles.newsImage}
                  />
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.newsDesc} numberOfLines={2}>
                      {item.description || "No description available"}
                    </Text>
                    <Text style={styles.newsMeta}>
                      {item.source.name} •{" "}
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            )}
          />

          {visibleCount < news.length && (
            <Pressable onPress={loadMore} style={styles.moreBtn}>
              <Text style={styles.moreText}>Load More</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
};

export default NewsList;

const styles = StyleSheet.create({
  newsHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 20,
  },
  newsCard: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginBottom: 12,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: COLORS.softShadow,
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  newsImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.primary,
  },
  newsDesc: {
    fontSize: 13.5,
    color: COLORS.gray,
  },
  newsMeta: {
    fontSize: 11.5,
    color: "#7F8C8D",
    marginTop: 6,
  },
  moreBtn: {
    alignSelf: "center",
    backgroundColor: "#E2EAF3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,

    ...Platform.select({
      ios: {
        shadowColor: COLORS.softShadow,
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  moreText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
