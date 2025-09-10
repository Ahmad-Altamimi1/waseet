import { I18nManager } from 'react-native';

export const isRTL = I18nManager.isRTL;

export const getRTLStyle = (ltrStyle: any, rtlStyle: any) => {
  return isRTL ? rtlStyle : ltrStyle;
};

export const getRTLValue = <T>(ltrValue: T, rtlValue: T): T => {
  return isRTL ? rtlValue : ltrValue;
};

export const getRTLIcon = (ltrIcon: string, rtlIcon: string): string => {
  return isRTL ? rtlIcon : ltrIcon;
};

export const getRTLTextAlign = (): 'left' | 'right' => {
  return isRTL ? 'right' : 'left';
};

export const getRTLFlexDirection = (): 'row' | 'row-reverse' => {
  return isRTL ? 'row-reverse' : 'row';
};

export const getRTLAlignItems = (): 'flex-start' | 'flex-end' => {
  return isRTL ? 'flex-end' : 'flex-start';
};

export const getRTLJustifyContent = (): 'flex-start' | 'flex-end' => {
  return isRTL ? 'flex-end' : 'flex-start';
};

export const getRTLMargin = (property: 'marginLeft' | 'marginRight', value: number) => {
  if (isRTL) {
    return property === 'marginLeft' ? { marginRight: value, marginLeft: 0 } : { marginLeft: value, marginRight: 0 };
  }
  return { [property]: value };
};

export const getRTLPadding = (property: 'paddingLeft' | 'paddingRight', value: number) => {
  if (isRTL) {
    return property === 'paddingLeft' ? { paddingRight: value, paddingLeft: 0 } : { paddingLeft: value, paddingRight: 0 };
  }
  return { [property]: value };
};

export const getRTLBorderRadius = (property: 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius', value: number) => {
  if (isRTL) {
    const mapping = {
      'borderTopLeftRadius': 'borderTopRightRadius',
      'borderTopRightRadius': 'borderTopLeftRadius',
      'borderBottomLeftRadius': 'borderBottomRightRadius',
      'borderBottomRightRadius': 'borderBottomLeftRadius',
    };
    return { [mapping[property]]: value };
  }
  return { [property]: value };
};

export const createRTLStyle = (baseStyle: any, rtlOverrides: any) => {
  return isRTL ? { ...baseStyle, ...rtlOverrides } : baseStyle;
};
