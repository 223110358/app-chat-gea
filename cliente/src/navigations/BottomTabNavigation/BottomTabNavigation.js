import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../hooks";
import { screens } from "../../Utils";
import {
    ChatsNavigation,
    GroupsNavigation,
    SettingsNavigation,
} from "../stacks";
import { styles } from "./BottomTabNavigation.styles";

const Tab = createBottomTabNavigator();

export function BottomTabNavigation() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBarStyle,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => screensIcon(route, color, size),
      })}
    >
      <Tab.Screen
        name={screens.tab.chats.root}
        component={ChatsNavigation}
        options={{ title: "Chats" }}
      />
      <Tab.Screen
        name={screens.tab.groups.root}
        component={GroupsNavigation}
        options={{ title: "Groups" }}
      />
      <Tab.Screen
        name={screens.tab.settings.root}
        component={SettingsNavigation}
        options={{ title: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}

function screensIcon(route, color, size) {
  let iconName;

  if (route.name === screens.tab.chats.root) {
    iconName = "chat";
  } else if (route.name === screens.tab.groups.root) {
    iconName = "account-group";
  } else if (route.name === screens.tab.settings.root) {
    iconName = "cog-outline";
  }

  return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
}
