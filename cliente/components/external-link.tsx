import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Text } from 'react-native';

type Props = ComponentProps<typeof Text> & { href: string };

export function ExternalLink({ href, onPress, ...rest }: Props) {
  return (
    <Text
      {...rest}
      onPress={async (event) => {
        onPress?.(event);
        await openBrowserAsync(href, {
          presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
        });
      }}
    />
  );
}
