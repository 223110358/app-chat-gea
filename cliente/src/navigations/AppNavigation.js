import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatScreen } from "../screens/Chat";
import {
  CameraScreen,
  ImageFullScreen,
  UserProfileScreen
} from "../screens/Global";
import {
  AddUserGroupScreen,
  ChangeNameGroupScreen,
  GroupProfileScreen,
  GroupScreen
} from "../screens/Groups";
import { screens } from "../Utils";
import { BottomTabNavigation } from "./BottomTabNavigation";
import { styles } from "./Styles.styles";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screens.tab.root}
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.global.chatScreen}
        component={ChatScreen}
        options={{
          headerShown: false,
          contentStyle: styles.stackContent,
          headerStyle: styles.stackHeader,
          headerTitleStyle: styles.stackHeaderTitle
        }}

      />
      <Stack.Screen
        name={screens.global.groupScreen}
        component={GroupScreen}
        options={{
          headerShown: false,
          contentStyle: styles.stackContent,
          headerStyle: styles.stackHeader,
          headerTitleStyle: styles.stackHeaderTitle
        }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          modalContent: styles.modalContent,
          modalHeader: styles.modalHeader,
          modalHeaderTitle: styles.modalHeaderTitle,
        }}
      >
        <Stack.Screen
          name={screens.global.userProfileScreen}
          component={UserProfileScreen}
          options={{
            title: "Informacion del usuario",
          }}
        />
        <Stack.Screen
          name={screens.global.groupProfileScreen}
          component={GroupProfileScreen}
          options={{
            title: "informacion del grupo",
          }}
        />
        <Stack.Screen
          name={screens.global.addUserGroupScreen}
          component={AddUserGroupScreen}
          options={{
            title: "Añadir usuario al grupo",
          }}
        />
        <Stack.Screen
          name={screens.global.changeNameGroupScreen}
          component={ChangeNameGroupScreen}
          options={{
            title: "Cambiar nombre del grupo",
          }}
        />
        <Stack.Screen
          name={screens.global.cameraScreen}
          component={CameraScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={screens.global.imagenFullScreen}
          component={ImageFullScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
