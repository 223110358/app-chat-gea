import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { IconBack } from '../../components/Navigation'
import { CreateGroupScreen, GroupScreen } from "../../screens/Groups"
import { screens } from '../../Utils'
import { styles } from '../Styles.styles'
const Stack = createNativeStackNavigator();
export function GroupsNavigation() {
  return (
    <Stack.Navigator
    screenOptions={{headerLeft:IconBack,
        contentStyle:styles.stackContent,
        headerStyle:styles.stackHeader,
        headerTitleStyle:styles.stackHeaderTitle
    }}>
        <Stack.Screen 
        name="GroupScreen"
        component={GroupScreen} 
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