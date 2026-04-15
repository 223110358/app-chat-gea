import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconBack } from "../../components/Navigation";
import { useTheme } from "../../hooks";
import { ChatsScreen, CreateChatScreen } from "../../screens/Chat";
import { screens } from "../../Utils";
import { createNavigationStyles } from "../Styles.styles";

const Stack = createNativeStackNavigator();

export function ChatsNavigation() { 
    const { colors } = useTheme();
    const styles = createNavigationStyles(colors);
    return(
        <Stack.Navigator
        screenOptions={{headerLeft:IconBack,
            contentStyle:styles.stackContent,
            headerStyle:styles.stackHeader,
            headerTitleStyle:styles.stackHeaderTitle
        }}>
            <Stack.Screen 
            name ={screens.tab.chats.chatsScreen}
            component={ChatsScreen}
            options={{title:"Chats"}}
            /> 
            <Stack.Screen 
            name ={screens.tab.chats.createChatScreen}
            component={CreateChatScreen}
            options={
                {
                    title:"Nuevo Chat", 
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
