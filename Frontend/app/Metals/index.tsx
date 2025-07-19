import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";

const USD_TO_INR = 86.16;

const MetalScreen = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [selectedMetal, setSelectedMetal] = useState<"gold" | "silver">("gold");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Metal Prices",
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: "#001D39" },
      headerTintColor: "#EDF4FB",
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const url =
      selectedMetal === "gold"
        ? "http://192.168.1.7:8000/home/metal_price/"
        : "http://192.168.1.7:8000/home/Silver/";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [selectedMetal]);

  const convertToINR = (usd: string) => {
    const num = parseFloat(usd);
    const inr = num * USD_TO_INR;
    return inr.toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001D39" />
        <Text style={styles.loadingText}>Loading {selectedMetal} prices...</Text>
      </View>
    );
  }

  if (error || !data || !data["Time Series (Daily)"]) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ Failed to load {selectedMetal} price data</Text>
      </View>
    );
  }

  const timeSeries = data["Time Series (Daily)"];
  const allDates = Object.keys(timeSeries).sort((a, b) => (a < b ? 1 : -1));

  const selectedDate =
    year.length === 4 && month.length === 2 && day.length === 2
      ? `${year}-${month}-${day}`
      : "";

  const filteredDates =
    selectedDate && timeSeries[selectedDate]
      ? [selectedDate]
      : allDates.slice(0, 10);

  const renderItem = ({ item: date }: { item: string }) => {
    const dayData = timeSeries[date];
    return (
      <View style={styles.card}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.detail}>Open: ₹{convertToINR(dayData["1. open"])}</Text>
        <Text style={styles.detail}>High: ₹{convertToINR(dayData["2. high"])}</Text>
        <Text style={styles.detail}>Low: ₹{convertToINR(dayData["3. low"])}</Text>
        <Text style={styles.detail}>Close: ₹{convertToINR(dayData["4. close"])}</Text>
        <Text style={styles.gramNote}>
          Price shown is for 2.6g of {selectedMetal}.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Metal selector buttons */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedMetal === "gold" && styles.activeButton,
          ]}
          onPress={() => setSelectedMetal("gold")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedMetal === "gold" && styles.activeText,
            ]}
          >
            Gold
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedMetal === "silver" && styles.activeButton,
          ]}
          onPress={() => setSelectedMetal("silver")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedMetal === "silver" && styles.activeText,
            ]}
          >
            Silver
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date filter inputs */}
      <View style={styles.dateInputRow}>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY"
          keyboardType="numeric"
          maxLength={4}
          value={year}
          onChangeText={setYear}
        />
        <TextInput
          style={styles.dateInput}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={styles.dateInput}
          placeholder="DD"
          keyboardType="numeric"
          maxLength={2}
          value={day}
          onChangeText={setDay}
        />
      </View>

      <FlatList
        data={filteredDates}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default MetalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 14,
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#001D39",
  },
  toggleText: {
    fontSize: 16,
    color: "#333",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001D39",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  gramNote: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
  },
});
