import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { IconBack } from '../../components/Navigation'
import { ChangeFirstnameScreen, ChangeLastnameScreen, SettingsScreen } from '../../screens/Settings'
import { screens } from '../../Utils'
import { styles } from '../Styles.styles'

const Stack = createNativeStackNavigator();

export function SettingsNavigation() {
  return (
    <Stack.Navigator
    screenOptions={{headerLeft:IconBack,
        contentStyle:styles.stackContent,
        headerStyle:styles.stackHeader,
        headerTitleStyle:styles.stackHeaderTitle
    }}>
        <Stack.Screen
        name ={screens.tab.settings.settingsScreen}
        component={SettingsScreen}
        options={{title: "Ajustes" }}
        />
        <Stack.Screen
        name ={screens.tab.settings.changeFirstnameScreen}
        component={ChangeFirstnameScreen}
        options={{title:"Cambiar Nombre",presentation:"modal"}}
        />
        <Stack.Screen
        name ={screens.tab.settings.changeLastnameScreen}
        component={ChangeLastnameScreen}
        options={{title:"Cambiar Apellido"}}
        />
    </Stack.Navigator>
  )
}