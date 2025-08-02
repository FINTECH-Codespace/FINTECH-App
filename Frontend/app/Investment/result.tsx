import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
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
  Modal,
} from "react-native";
import { allocations } from './data'

const { width } = Dimensions.get("window");

export default function Result() {
  const navigation = useNavigation();
  const router = useRouter();
  const { 
    score, 
    income, 
    saving, 
    currentAge,
    targetGoalAge,
    goalCostToday,
    profileHealthSummary,
    level = "1",
    allAnswers = "[]"
  } = useLocalSearchParams();
  
  const currentLevel = parseInt(level as string);
  const numericScore = parseInt(score as string, 10);

  const [amountToInvest, setAmountToInvest] = useState("");
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [parsedAnswers, setParsedAnswers] = useState<any[]>([]);

  type Allocation = { asset: string; percent: number };
  type AllocationWithAmount = Allocation & { amount?: number };

  const [allocationWithAmount, setAllocationWithAmount] = useState<AllocationWithAmount[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Investment Result - Level ${currentLevel}`,
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: "#001D39" },
      headerTintColor: "#EDF4FB",
    });
  }, [navigation, currentLevel]);

  React.useEffect(() => {
    try {
      const parsed = JSON.parse(allAnswers as string);
      setParsedAnswers(parsed);
    } catch (error) {
      setParsedAnswers([]);
    }
  }, [allAnswers]);

  const getProfile = (score: number): keyof typeof allocations => {
    if (score >= 7 && score <= 13) return "Risk Averser";
    if (score >= 14 && score <= 19) return "Conservative";
    if (score >= 20 && score <= 25) return "Moderate";
    if (score >= 26 && score <= 30) return "Growth-Oriented";
    return "Risk Taker";
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

  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    router.push({
      pathname: "/Investment",
      params: {
        level: nextLevel.toString(),
        previousAnswers: allAnswers,
      },
    });
  };

  const renderAnswersModal = () => (
    <Modal
      visible={showAnswersModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Your Quiz Answers</Text>
          <TouchableOpacity
            onPress={() => setShowAnswersModal(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {parsedAnswers.map((answer, index) => (
            <View key={index} style={styles.answerItem}>
              <Text style={styles.answerLevel}>Level {answer.level}</Text>
              <Text style={styles.answerCategory}>{answer.category}</Text>
              <Text style={styles.answerQuestion}>{answer.question}</Text>
              <Text style={styles.answerSelected}>
                Answer: {answer.selectedAnswer}
              </Text>
              {answer.score > 0 && (
                <Text style={styles.answerScore}>Score: {answer.score}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>🏆 Your Investment Profile</Text>
          <Text style={styles.score}>{numericScore}/33</Text>
          <Text style={styles.profileLabel}>Risk Profile</Text>
          <Text style={styles.profileValue}>{profile}</Text>
          <Text style={styles.levelIndicator}>Level {currentLevel} Complete</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoHeading}>💼 Financial Details</Text>
          <Text style={styles.infoItem}>Income: ₹{income}</Text>
          <Text style={styles.infoItem}>Saving: ₹{saving}</Text>
          {currentAge !== "0" && (
            <Text style={styles.infoItem}>Current Age: {currentAge}</Text>
          )}
          {targetGoalAge !== "0" && (
            <Text style={styles.infoItem}>Target Age: {targetGoalAge}</Text>
          )}
          {goalCostToday !== "0" && (
            <Text style={styles.infoItem}>Goal Cost: ₹{goalCostToday}</Text>
          )}
          {profileHealthSummary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryLabel}>Health Summary:</Text>
              <Text style={styles.summaryText}>{profileHealthSummary}</Text>
            </View>
          )}
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
            (item: any, index) => (
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

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => setShowAnswersModal(true)}
          >
            <Text style={styles.reviewButtonText}>📋 Review Answers</Text>
          </TouchableOpacity>

          {currentLevel < 3 && (
            <TouchableOpacity
              style={styles.nextLevelButton}
              onPress={handleNextLevel}
            >
              <Text style={styles.nextLevelButtonText}>
                Continue to Level {currentLevel + 1} →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {currentLevel === 3 && (
          <View style={styles.completionCard}>
            <Text style={styles.completionText}>
              🎉 Congratulations! You've completed all quiz levels.
            </Text>
            <Text style={styles.completionSubtext}>
              Your comprehensive investment profile is now ready!
            </Text>
          </View>
        )}
      </ScrollView>

      {renderAnswersModal()}
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
  levelIndicator: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6EA2B3",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#E8F4F8",
    borderRadius: 12,
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
  summaryContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#C4DFED",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003B57",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: "#001D39",
    lineHeight: 20,
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
  actionButtons: {
    width: width * 0.9,
    marginTop: 20,
  },
  reviewButton: {
    backgroundColor: "#6EA2B3",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nextLevelButton: {
    backgroundColor: "#001D39",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 6,
  },
  nextLevelButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  completionCard: {
    width: width * 0.9,
    backgroundColor: "#E8F5E8",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  completionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  completionSubtext: {
    fontSize: 14,
    color: "#388E3C",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#EDF4FB",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#C4DFED",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#001D39",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  answerItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  answerLevel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6EA2B3",
    backgroundColor: "#E8F4F8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  answerCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A4174",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  answerQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001D39",
    marginBottom: 8,
    lineHeight: 22,
  },
  answerSelected: {
    fontSize: 15,
    color: "#4E8EA2",
    marginBottom: 4,
    fontWeight: "500",
  },
  answerScore: {
    fontSize: 13,
    color: "#6EA2B3",
    fontWeight: "600",
  },
});