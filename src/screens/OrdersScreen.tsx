import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { getUserOrders } from "../services/dummyData";

const OrdersScreen: React.FC = () => {
  const { state } = useApp();
  const userOrders = state.user ? getUserOrders(state.user.id) : [];

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.id}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.orderDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.orderTotal}>${item.totalAmount.toFixed(2)}</Text>
      <TouchableOpacity style={styles.trackButton}>
        <Text style={styles.trackButtonText}>Track Order</Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color={theme.colors.accent.lavender}
        />
      </TouchableOpacity>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return theme.colors.status.warning;
      case "approved":
        return theme.colors.status.success;
      case "shipped":
        return theme.colors.accent.lavender;
      case "delivered":
        return theme.colors.status.success;
      default:
        return theme.colors.neutral.gray400;
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        {state.currentOrder.length > 0 && (
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons
              name="bag-outline"
              size={24}
              color={theme.colors.accent.lavender}
            />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {state.currentOrder.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Order */}
        {state.currentOrder.length > 0 && (
          <View style={styles.currentOrderSection}>
            <Text style={styles.sectionTitle}>Current Order</Text>
            <View style={styles.currentOrderCard}>
              <Text style={styles.currentOrderText}>
                {state.currentOrder.length} item
                {state.currentOrder.length !== 1 ? "s" : ""} ready to order
              </Text>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Order History</Text>
          {userOrders.length > 0 ? (
            <FlatList
              data={userOrders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="bag-outline"
                size={64}
                color={theme.colors.neutral.gray300}
              />
              <Text style={styles.emptyStateText}>No orders yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start shopping to see your orders here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes["2xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  cartButton: {
    position: "relative",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.accent.gold,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: theme.colors.text.white,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  currentOrderSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  currentOrderCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  currentOrderText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  confirmButton: {
    backgroundColor: theme.colors.accent.lavender,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignSelf: "flex-start",
  },
  confirmButtonText: {
    color: theme.colors.text.white,
    fontWeight: theme.typography.weights.semibold,
  },
  historySection: {
    marginBottom: theme.spacing.lg,
  },
  orderCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  orderNumber: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  orderDate: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  orderTotal: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  trackButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.accent.lavender,
    marginRight: theme.spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing["3xl"],
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.light,
    marginTop: theme.spacing.sm,
  },
});

export default OrdersScreen;
