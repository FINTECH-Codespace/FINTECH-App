import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Result() {
  const navigation = useNavigation();
  const { score, income, saving } = useLocalSearchParams();
  const numericScore = parseInt(score as string, 10);

  const [amountToInvest, setAmountToInvest] = useState("");

  type Allocation = { asset: string; percent: number };
  type AllocationWithAmount = Allocation & { amount?: number };

  const [allocationWithAmount, setAllocationWithAmount] = useState<AllocationWithAmount[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Investment Result",
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: "#001D39" },
      headerTintColor: "#EDF4FB",
    });
  }, [navigation]);

  const getProfile = (score: number) => {
    if (score <= 10) return "Conservative";
    if (score <= 16) return "Moderate";
    if (score <= 22) return "Growth-Oriented";
    return "Aggressive";
  };

  const allocations: Record<string, Allocation[]> = {
    Conservative: [
      { asset: "Fixed Deposits (FDs)", percent: 40 },
      { asset: "Mutual Funds (Debt or Balanced)", percent: 30 },
      { asset: "Gold", percent: 15 },
      { asset: "Real Estate", percent: 10 },
      { asset: "Equities", percent: 5 },
    ],
    Moderate: [
      { asset: "Mutual Funds (Balanced)", percent: 30 },
      { asset: "Equities", percent: 25 },
      { asset: "Real Estate", percent: 20 },
      { asset: "Gold", percent: 10 },
      { asset: "Fixed Deposits (FDs)", percent: 15 },
    ],
    "Growth-Oriented": [
      { asset: "Equities", percent: 40 },
      { asset: "Mutual Funds (Equity)", percent: 25 },
      { asset: "Real Estate", percent: 20 },
      { asset: "Gold", percent: 15 },
    ],
    Aggressive: [
      { asset: "Equities", percent: 60 },
      { asset: "Mutual Funds (Equity)", percent: 25 },
      { asset: "Real Estate", percent: 10 },
      { asset: "Gold", percent: 5 },
    ],
  };

  const profile = getProfile(numericScore);
  const baseAllocation: Allocation[] = allocations[profile];

  const handleAllocationCalculation = () => {
    const amt = parseFloat(amountToInvest);
    if (!isNaN(amt)) {
      const updated = baseAllocation.map((item) => ({
        ...item,
        amount: Math.round((item.percent / 100) * amt),
      }));
      setAllocationWithAmount(updated);
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>🏆 Your Investment Profile</Text>
          <Text style={styles.score}>{numericScore}/33</Text>
          <Text style={styles.profileLabel}>Risk Profile</Text>
          <Text style={styles.profileValue}>{profile}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoHeading}>💼 Financial Details</Text>
          <Text style={styles.infoItem}>Income: ₹{income}</Text>
          <Text style={styles.infoItem}>Saving: ₹{saving}</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Enter amount to invest"
            value={amountToInvest}
            onChangeText={setAmountToInvest}
            keyboardType="numeric"
            style={styles.inputBox}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.goButton} onPress={handleAllocationCalculation}>
            <Text style={styles.goText}>Go</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.allocationCard}>
          <Text style={styles.subheading}>📊 Recommended Allocation</Text>
          <View style={styles.allocationHeader}>
            <Text style={[styles.asset, { flex: 2 }]}>Asset</Text>
            <Text style={[styles.percent, { flex: 1 }]}>%</Text>
            {allocationWithAmount.length > 0 && (
              <Text style={[styles.amount, { flex: 1.5 }]}>Amount (₹)</Text>
            )}
          </View>
          {(allocationWithAmount.length > 0 ? allocationWithAmount : baseAllocation).map(
            (item : any, index) => (
              <View key={index} style={styles.allocationRow}>
                <Text style={[styles.asset, { flex: 2 }]}>{item.asset}</Text>
                <Text style={[styles.percent, { flex: 1 }]}>{item.percent}%</Text>
                {item.amount != null && (
                  <Text style={[styles.amount, { flex: 1.5 }]}>₹{item.amount}</Text>
                )}
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EDF4FB",
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    elevation: 8,
    shadowColor: "#001D39",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#001D39",
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontWeight: "800",
    color: "#4E8EA2",
  },
  profileLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  profileValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#001D39",
    marginTop: 2,
  },
  infoCard: {
    width: width * 0.9,
    backgroundColor: "#DFF1FF",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    elevation: 6,
    shadowColor: "#003B57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  infoHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 16,
    color: "#001D39",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
    width: width * 0.9,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    fontSize: 16,
    borderColor: "#C4DFED",
    borderWidth: 1,
    marginRight: 12,
    color: "#001D39",
  },
  goButton: {
    backgroundColor: "#001D39",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 4,
  },
  goText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  allocationCard: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003B57",
    marginBottom: 12,
  },
  allocationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#C4DFED",
    marginBottom: 6,
  },
  allocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#C4DFED",
  },
  asset: {
    fontSize: 16,
    color: "#001D39",
  },
  percent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4E8EA2",
    textAlign: "right",
  },
  amount: {
    fontSize: 16,
    color: "#003B57",
    fontWeight: "600",
    textAlign: "right",
  },
});
