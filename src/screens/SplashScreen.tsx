import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { theme } from "../constants/theme";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);

  useEffect(() => {
    // Start animations
    logoScale.value = withTiming(1, { duration: 800 });
    logoOpacity.value = withTiming(1, { duration: 800 });

    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));

    // Navigate to main app after animation
    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  return (
    <LinearGradient
      colors={theme.colors.gradients.lightGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Background pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Logo Animation */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <LottieView
          source={require("../assets/animations/splash.json")}
          style={styles.lottieAnimation}
          autoPlay
          loop
        />
      </Animated.View>

      {/* App Name */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.appName}>Aura</Text>
        <Text style={styles.tagline}>Fashion • Lifestyle • You</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: withDelay(1000, withTiming("100%", { duration: 1500 })),
              },
            ]}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary.white,
  },
  backgroundPattern: {
    position: "absolute",
    width: width,
    height: height,
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: theme.colors.accent.lavender,
    opacity: 0.05,
  },
  circle1: {
    width: 200,
    height: 200,
    top: height * 0.1,
    left: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: height * 0.7,
    right: -30,
    backgroundColor: theme.colors.accent.gold,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: width * 0.2,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  appName: {
    fontSize: theme.typography.sizes["5xl"],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accent.lavender,
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.light,
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
  loadingContainer: {
    position: "absolute",
    bottom: height * 0.15,
    width: width * 0.6,
    alignItems: "center",
  },
  loadingBar: {
    width: "100%",
    height: 3,
    backgroundColor: theme.colors.neutral.gray200,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: theme.colors.accent.lavender,
    borderRadius: theme.borderRadius.full,
  },
});

export default SplashScreen;
