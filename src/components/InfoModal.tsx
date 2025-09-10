import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttonText,
  onButtonPress,
  type = 'info',
  icon,
}) => {
  const { t, isRTL } = useLanguage();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    onClose();
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: icon || 'checkmark-circle-outline',
          iconColor: theme.colors.status.success,
          gradient: [theme.colors.status.success, '#059669'],
          backgroundColor: `${theme.colors.status.success}20`,
        };
      case 'warning':
        return {
          icon: icon || 'warning-outline',
          iconColor: theme.colors.status.warning,
          gradient: [theme.colors.status.warning, '#D97706'],
          backgroundColor: `${theme.colors.status.warning}20`,
        };
      case 'error':
        return {
          icon: icon || 'alert-circle-outline',
          iconColor: theme.colors.status.error,
          gradient: [theme.colors.status.error, '#DC2626'],
          backgroundColor: `${theme.colors.status.error}20`,
        };
      default:
        return {
          icon: icon || 'information-circle-outline',
          iconColor: theme.colors.status.info,
          gradient: [theme.colors.status.info, '#2563EB'],
          backgroundColor: `${theme.colors.status.info}20`,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
      animationType="scale"
    >
      <View style={[styles.container, isRTL && styles.rtlContainer]}>
        {/* Icon with Animation */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[
              config.backgroundColor,
              `${config.iconColor}10`,
            ]}
            style={styles.iconBackground}
          >
            <Ionicons
              name={config.icon as any}
              size={56}
              color={config.iconColor}
            />
            
            {/* Pulse Effect for Success */}
            {type === 'success' && (
              <View style={[styles.pulseRing, { borderColor: config.iconColor }]} />
            )}
          </LinearGradient>
          
          {/* Sparkles for Success */}
          {type === 'success' && (
            <>
              <View style={[styles.sparkle, styles.sparkle1]}>
                <Text style={styles.sparkleText}>✨</Text>
              </View>
              <View style={[styles.sparkle, styles.sparkle2]}>
                <Text style={styles.sparkleText}>🎉</Text>
              </View>
              <View style={[styles.sparkle, styles.sparkle3]}>
                <Text style={styles.sparkleText}>⭐</Text>
              </View>
            </>
          )}
        </View>

        {/* Message */}
        <Text style={[styles.message, isRTL && styles.rtlText]}>
          {message}
        </Text>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={[styles.buttonText, isRTL && styles.rtlText]}>
              {buttonText || t('common.ok')}
            </Text>
            
            {/* Button Icon */}
            <View style={styles.buttonIcon}>
              <Ionicons
                name={type === 'success' ? 'checkmark' : 'arrow-forward'}
                size={18}
                color={theme.colors.text.white}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  rtlContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xl,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: theme.colors.status.success,
    opacity: 0.3,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -10,
    right: 10,
  },
  sparkle2: {
    bottom: 5,
    left: -5,
  },
  sparkle3: {
    top: 20,
    right: -15,
  },
  sparkleText: {
    fontSize: 16,
  },
  message: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  rtlText: {
    textAlign: 'right',
  },
  button: {
    width: '100%',
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 56,
  },
  buttonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.white,
    marginRight: theme.spacing.sm,
  },
  buttonIcon: {
    marginLeft: theme.spacing.sm,
  },
});

export default InfoModal;
