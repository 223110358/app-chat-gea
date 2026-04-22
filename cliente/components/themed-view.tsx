import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Solo usar backgroundColor si se proporcionan colores específicos
  const backgroundColor = (lightColor || darkColor)
    ? useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    : useThemeColor({}, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
