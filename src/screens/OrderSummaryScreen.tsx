import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

const OrderSummaryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary.white,
  },
  title: {
    fontSize: theme.typography.sizes["2xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
});

export default OrderSummaryScreen;
