import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "expo-router";

const StockScreen = () => {
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Stocks",
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: "#001D39" },
      headerTintColor: "#EDF4FB",
    });
  }, []);

  useEffect(() => {
    fetch("http://192.168.1.7:8000/home/top_stocks/")
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP Error:", res.status, res.statusText);
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        let all: any[] = [];

        json.legends.forEach(([key]: [string, string]) => {
          const section = json[key];
          if (section && section.data) {
            all = all.concat(section.data);
          }
        });

        // Sort by net_price in descending order
        all.sort((a, b) => b.net_price - a.net_price);

        setAllStocks(all);
        setFilteredStocks(all);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = allStocks
      .filter((item) =>
        item.symbol.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.net_price - a.net_price); // always keep it sorted

    setFilteredStocks(filtered);
    setVisibleCount(15); // reset on search
  }, [search, allStocks]);

  const renderStockItem = ({ item }: any) => {
    const isPositive = item.net_price >= 0;
    return (
      <View style={styles.card}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.price}>LTP: ₹{item.ltp}</Text>
        <Text
          style={[styles.change, { color: isPositive ? "#16a34a" : "#dc2626" }]}
        >
          Change: ₹{item.net_price} ({item.perChange}%)
        </Text>
        <Text style={styles.details}>
          Open: ₹{item.open_price} | High: ₹{item.high_price} | Low: ₹
          {item.low_price}
        </Text>
        <Text style={styles.details}>
          Qty: {item.trade_quantity} | Turnover: ₹{item.turnover.toFixed(2)}
        </Text>
        {item.ca_purpose ? (
          <Text style={styles.dividend}>{item.ca_purpose}</Text>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading stocks...</Text>
      </View>
    );
  }

  if (error || !allStocks.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ Failed to load stock data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search stocks..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredStocks.slice(0, visibleCount)}
        keyExtractor={(item, index) => `${item.symbol}-${index}`}
        renderItem={renderStockItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListFooterComponent={() =>
          visibleCount < filteredStocks.length ? (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => setVisibleCount((prev) => prev + 10)}
            >
              <Text style={styles.moreButtonText}>Show More</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f0ff",
    padding: 14,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  details: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  dividend: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#999",
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff4d4f",
    textAlign: "center",
  },
  moreButton: {
    alignSelf: "center",
    backgroundColor: "#E2EAF3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,

    ...Platform.select({
      ios: {
        shadowColor: "#94b2e3ff",
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  moreButtonText: {
    color: "#001D39",
    fontWeight: "600",
    fontSize: 15,
  },
});
