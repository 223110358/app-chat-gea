import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Options, UserInfo } from "../../components/Settings";
import { useAuth, useTheme } from "../../hooks";

export function SettingsScreen() {
  const { user, logout, accessToken, updateUser } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <UserInfo user={user} />
        <Options
          accessToken={accessToken}
          logout={logout}
          updateUser={updateUser}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      width: "100%",
      maxWidth: 760,
      alignSelf: "center",
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
  });
