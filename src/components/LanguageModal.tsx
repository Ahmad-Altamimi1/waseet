import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
  const { currentLanguage, changeLanguage, t, isRTL } = useLanguage();

  const handleLanguageSelect = async (language: 'en' | 'ar') => {
    await changeLanguage(language);
    onClose();
  };

  const languages = [
    {
      code: 'en' as const,
      name: t('profile.english'),
      nativeName: 'English',
      icon: '🇺🇸',
      gradient: [theme.colors.accent.lavender, theme.colors.accent.deepLavender],
    },
    {
      code: 'ar' as const,
      name: t('profile.arabic'),
      nativeName: 'العربية',
      icon: '🇸🇦',
      gradient: [theme.colors.accent.gold, theme.colors.accent.lightGold],
    },
  ];

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={t('profile.select_language')}
      subtitle={t('profile.language_subtitle') || 'Choose your preferred language'}
      animationType="scale"
    >
      <View style={[styles.languageContainer, isRTL && styles.rtlContainer]}>
        {languages.map((language, index) => {
          const isSelected = currentLanguage === language.code;
          
          return (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                index > 0 && styles.languageOptionSpacing,
                isRTL && styles.rtlLanguageOption,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isSelected
                    ? language.gradient
                    : [theme.colors.primary.white, theme.colors.neutral.gray100]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.languageGradient,
                  isSelected && styles.selectedLanguage,
                ]}
              >
                <View style={[styles.languageContent, isRTL && styles.rtlContent]}>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageFlag}>{language.icon}</Text>
                    <View style={styles.languageTexts}>
                      <Text
                        style={[
                          styles.languageName,
                          isSelected && styles.selectedText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {language.name}
                      </Text>
                      <Text
                        style={[
                          styles.languageNative,
                          isSelected && styles.selectedSubText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {language.nativeName}
                      </Text>
                    </View>
                  </View>

                  {/* Selection Indicator */}
                  <View
                    style={[
                      styles.selectionIndicator,
                      isSelected && styles.selectedIndicator,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.text.white}
                      />
                    )}
                  </View>
                </View>

                {/* Sparkle Effect for Selected */}
                {isSelected && (
                  <>
                    <View style={[styles.sparkle, styles.sparkle1]}>
                      <Text style={styles.sparkleText}>✨</Text>
                    </View>
                    <View style={[styles.sparkle, styles.sparkle2]}>
                      <Text style={styles.sparkleText}>💫</Text>
                    </View>
                    <View style={[styles.sparkle, styles.sparkle3]}>
                      <Text style={styles.sparkleText}>⭐</Text>
                    </View>
                  </>
                )}
              </LinearGradient>

              {/* Glow Effect for Selected */}
              {isSelected && (
                <LinearGradient
                  colors={[
                    'rgba(168, 85, 247, 0.3)',
                    'rgba(168, 85, 247, 0.1)',
                    'transparent',
                  ]}
                  style={styles.glowEffect}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Note */}
      <View style={[styles.footer, isRTL && styles.rtlFooter]}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={theme.colors.text.light}
        />
        <Text style={[styles.footerText, isRTL && styles.rtlText]}>
          {t('profile.language_note') || 'Language changes will be applied immediately'}
        </Text>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    marginTop: theme.spacing.md,
  },
  rtlContainer: {
    flexDirection: 'column-reverse',
  },
  languageOption: {
    position: 'relative',
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  languageOptionSpacing: {
    marginTop: theme.spacing.md,
  },
  rtlLanguageOption: {
    alignSelf: 'stretch',
  },
  languageGradient: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguage: {
    borderColor: theme.colors.accent.lavender,
    ...theme.shadows.accent,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  rtlContent: {
    flexDirection: 'row-reverse',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  languageTexts: {
    flex: 1,
  },
  languageName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  selectedText: {
    color: theme.colors.text.white,
  },
  languageNative: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  selectedSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rtlText: {
    textAlign: 'right',
  },
  selectionIndicator: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 8,
    right: 8,
  },
  sparkle2: {
    bottom: 12,
    left: 12,
  },
  sparkle3: {
    top: '50%',
    right: 30,
  },
  sparkleText: {
    fontSize: 12,
    opacity: 0.8,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: theme.borderRadius.xl + 4,
    zIndex: -1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  rtlFooter: {
    flexDirection: 'row-reverse',
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.light,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});

export default LanguageModal;
