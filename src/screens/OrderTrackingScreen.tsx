import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../constants/theme";
import {
  getOrderById,
  orderStatusInfo,
  orderStatusFlow,
  updateOrderStatus,
} from "../services/dummyData";
import { RootStackParamList, OrderStatus } from "../types";
import { useApp } from "../context/AppContext";

type OrderTrackingScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;
type OrderTrackingScreenRouteProp = RouteProp<
  RootStackParamList,
  "OrderTracking"
>;

const OrderTrackingScreen: React.FC = () => {
  const navigation = useNavigation<OrderTrackingScreenNavigationProp>();
  const route = useRoute<OrderTrackingScreenRouteProp>();
  const { orderId } = route.params;
  const { state } = useApp();

  const [order, setOrder] = useState(() => getOrderById(orderId));

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={80}
          color={theme.colors.neutral.gray300}
        />
        <Text style={styles.errorTitle}>Order Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The order you're looking for doesn't exist.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleStatusUpdate = () => {
    if (!state.isAdmin) {
      Alert.alert("Access Denied", "Only admins can update order status.");
      return;
    }

    const nextStatus = orderStatusFlow[order.status as OrderStatus];
    if (!nextStatus) {
      Alert.alert("Status Update", "Order is already at final status.");
      return;
    }

    Alert.alert(
      "Update Order Status",
      `Update order status from "${order.status}" to "${nextStatus}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: () => {
            const updatedOrder = updateOrderStatus(orderId, nextStatus);
            if (updatedOrder) {
              setOrder(updatedOrder);
              Alert.alert("Success", "Order status updated successfully!");
            }
          },
        },
      ]
    );
  };

  const getStatusSteps = () => {
    const allStatuses: OrderStatus[] = [
      "pending",
      "approved",
      "ordered",
      "shipped",
      "delivered",
    ];
    const currentIndex = allStatuses.indexOf(order.status as OrderStatus);

    return allStatuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
      info: orderStatusInfo[status],
    }));
  };

  const statusSteps = getStatusSteps();
  const currentStatusInfo = orderStatusInfo[order.status as OrderStatus];

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.orderTotal}>
            Total: ${order.totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Current Status Card */}
        <View style={styles.currentStatusCard}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: currentStatusInfo.color },
              ]}
            >
              <Ionicons
                name={currentStatusInfo.icon as any}
                size={24}
                color={theme.colors.text.white}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>{currentStatusInfo.label}</Text>
              <Text style={styles.statusDescription}>
                {currentStatusInfo.description}
              </Text>
            </View>
          </View>
          <Text style={styles.lastUpdate}>
            Last updated: {new Date(order.updatedAt).toLocaleString()}
          </Text>
        </View>

        {/* Progress Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Order Progress</Text>

          {statusSteps.map((step, index) => (
            <View key={step.status} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineIcon,
                    {
                      backgroundColor: step.completed
                        ? step.info.color
                        : theme.colors.neutral.gray300,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      step.completed
                        ? step.current
                          ? (step.info.icon as any)
                          : "checkmark"
                        : (step.info.icon as any)
                    }
                    size={16}
                    color={theme.colors.text.white}
                  />
                </View>
                {index < statusSteps.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor: step.completed
                          ? step.info.color
                          : theme.colors.neutral.gray300,
                      },
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    {
                      color: step.completed
                        ? theme.colors.text.primary
                        : theme.colors.text.light,
                      fontWeight: step.current
                        ? theme.typography.weights.bold
                        : theme.typography.weights.medium,
                    },
                  ]}
                >
                  {step.info.label}
                </Text>
                <Text
                  style={[
                    styles.timelineDescription,
                    {
                      color: step.completed
                        ? theme.colors.text.secondary
                        : theme.colors.text.light,
                    },
                  ]}
                >
                  {step.info.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>
            Order Items ({order.products.length})
          </Text>
          {order.products.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name || "Fashion Item"}
                </Text>
                <Text style={styles.productDetails}>
                  {product.color && `${product.color} • `}
                  {product.size && `${product.size} • `}
                  Qty: {product.quantity}
                </Text>
              </View>
              <Text style={styles.productPrice}>
                ${(product.price * product.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Admin Actions */}
        {state.isAdmin && (
          <View style={styles.adminCard}>
            <Text style={styles.adminTitle}>Admin Actions</Text>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleStatusUpdate}
            >
              <LinearGradient
                colors={[
                  theme.colors.accent.gold,
                  theme.colors.accent.lightGold,
                ]}
                style={styles.updateButtonGradient}
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color={theme.colors.text.white}
                />
                <Text style={styles.updateButtonText}>Update Status</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  orderHeader: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: "center",
    ...theme.shadows.sm,
  },
  orderNumber: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  orderDate: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  orderTotal: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.accent.lavender,
  },
  currentStatusCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statusDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  lastUpdate: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.light,
    fontStyle: "italic",
  },
  timelineCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  timelineTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: theme.typography.sizes.base,
    marginBottom: theme.spacing.xs,
  },
  timelineDescription: {
    fontSize: theme.typography.sizes.sm,
  },
  itemsCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  itemsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  productDetails: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  productPrice: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.accent.lavender,
  },
  adminCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  adminTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  updateButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  updateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  updateButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary.white,
    paddingHorizontal: theme.spacing.lg,
  },
  errorTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  errorSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    backgroundColor: theme.colors.accent.lavender,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
});

export default OrderTrackingScreen;
