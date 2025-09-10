import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { theme } from "../constants/theme";
import { getOrderById } from "../services/dummyData";
import { RootStackParamList } from "../types";

type OrderConfirmationScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;
type OrderConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  "OrderConfirmation"
>;

const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<OrderConfirmationScreenNavigationProp>();
  const route = useRoute<OrderConfirmationScreenRouteProp>();
  const { orderId } = route.params;

  const order = getOrderById(orderId);

  const checkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    // Animate the success checkmark
    checkScale.value = withDelay(300, withSpring(1, { duration: 800 }));

    // Animate the content
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(600, withTiming(0, { duration: 600 }));
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <Animated.View style={[styles.successIcon, checkAnimatedStyle]}>
          <LinearGradient
            colors={[theme.colors.status.success, "#10B981"]}
            style={styles.successIconGradient}
          >
            <Ionicons
              name="checkmark"
              size={60}
              color={theme.colors.text.white}
            />
          </LinearGradient>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <Text style={styles.title}>Order Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>
            Your order has been successfully placed and is being processed.
          </Text>

          {/* Order Details Card */}
          <View style={styles.orderCard}>
            <Text style={styles.orderCardTitle}>Order Details</Text>

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order Number</Text>
              <Text style={styles.orderValue}>#{order.id}</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Items</Text>
              <Text style={styles.orderValue}>
                {order.products.length} item
                {order.products.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Amount</Text>
              <Text style={styles.orderValue}>
                ${order.totalAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>PENDING</Text>
              </View>
            </View>
          </View>

          {/* Next Steps */}
          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>What's Next?</Text>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                We'll review your order within 24 hours
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Once approved, we'll place the order with suppliers
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Track your order progress in real-time
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() =>
                navigation.navigate("OrderTracking", { orderId: order.id })
              }
            >
              <LinearGradient
                colors={[
                  theme.colors.accent.lavender,
                  theme.colors.accent.deepLavender,
                ]}
                style={styles.trackButtonGradient}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.colors.text.white}
                />
                <Text style={styles.trackButtonText}>Track Order</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate("Main")}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  successIcon: {
    alignSelf: "center",
    marginBottom: theme.spacing.xl,
  },
  successIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.lg,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.sizes["3xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  orderCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    width: "100%",
    ...theme.shadows.sm,
  },
  orderCardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  orderLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  orderValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    backgroundColor: theme.colors.status.warning,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  nextStepsCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    width: "100%",
    ...theme.shadows.sm,
  },
  nextStepsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.accent.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  stepNumberText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    width: "100%",
    gap: theme.spacing.md,
  },
  trackButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  trackButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  trackButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  continueButton: {
    backgroundColor: theme.colors.neutral.gray200,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.status.error,
    textAlign: "center",
  },
});

export default OrderConfirmationScreen;
