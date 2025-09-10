import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { RootStackParamList, Product } from "../types";

type OrderSummaryNavigationProp = StackNavigationProp<RootStackParamList>;

const OrderSummaryScreen: React.FC = () => {
  const { state, actions } = useApp();
  const navigation = useNavigation<OrderSummaryNavigationProp>();

  const totalAmount = state.currentOrder.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    const order = await actions.confirmOrder();
    if (order) {
      navigation.navigate("OrderConfirmation", { orderId: order.id });
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name || "Fashion Item"}
        </Text>
        <Text style={styles.productDetails}>
          {item.color && `${item.color} • `}
          {item.size && `${item.size} • `}
          Qty: {item.quantity}
        </Text>
        <Text style={styles.productPrice}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Remove",
                style: "destructive",
                onPress: () => actions.removeProduct(item.id),
              },
            ]
          );
        }}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.colors.status.error}
        />
      </TouchableOpacity>
    </View>
  );

  if (state.currentOrder.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="bag-outline"
          size={80}
          color={theme.colors.neutral.gray300}
        />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some items to get started
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={[
              theme.colors.accent.lavender,
              theme.colors.accent.deepLavender,
            ]}
            style={styles.shopButtonGradient}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Items ({state.currentOrder.length})
          </Text>
          <FlatList
            data={state.currentOrder}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({state.currentOrder.length} items)
            </Text>
            <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>$5.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(totalAmount + 5).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            Alert.alert(
              "Clear Cart",
              "Are you sure you want to remove all items?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: actions.clearCart,
                },
              ]
            );
          }}
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
          disabled={state.isLoading}
        >
          <LinearGradient
            colors={[theme.colors.accent.gold, theme.colors.accent.lightGold]}
            style={styles.confirmButtonGradient}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.colors.text.white}
            />
            <Text style={styles.confirmButtonText}>
              {state.isLoading ? "Processing..." : "Confirm Order"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.gray100,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  productCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  productDetails: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accent.lavender,
  },
  removeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.gray100,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accent.lavender,
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.primary.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing.md,
  },
  clearButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral.gray200,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  confirmButton: {
    flex: 2,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  confirmButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  confirmButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary.white,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  shopButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  shopButtonGradient: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  shopButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
  },
});

export default OrderSummaryScreen;
