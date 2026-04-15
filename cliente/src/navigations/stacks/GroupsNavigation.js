import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { IconBack } from '../../components/Navigation'
import { useTheme } from '../../hooks'
import { CreateGroupScreen, GroupsScreen } from "../../screens/Groups"
import { screens } from '../../Utils'
import { createNavigationStyles } from '../Styles.styles'
const Stack = createNativeStackNavigator();
export function GroupsNavigation() {
  const { colors } = useTheme();
  const styles = createNavigationStyles(colors);
  return (
    <Stack.Navigator
    screenOptions={{headerLeft:IconBack,
        contentStyle:styles.stackContent,
        headerStyle:styles.stackHeader,
        headerTitleStyle:styles.stackHeaderTitle
    }}>
        <Stack.Screen 
        name={screens.tab.groups.groupsScreen}
        component={GroupsScreen}
        options={{ title: "Grupos" }}
        />
        <Stack.Screen 
        name ={screens.tab.groups.createGroupScreen}
        component={CreateGroupScreen}
        options={
            {
                title:"Nuevo Grupo", 
                presentation:"modal",
                modalContent:styles.modalContent,
                modalHeader:styles.modalHeader,
                modalHeaderTitle:styles.modalHeaderTitle
            } 
        }
        />
    </Stack.Navigator>
  )
}
