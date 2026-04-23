import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconBack } from "../../components/Navigation";
import { ChatsScreen, CreateChatScreen, ChatScreen } from "../../screens/Chat";
import { screens } from "../../Utils";
import { styles } from "../Styles.styles";

const Stack = createNativeStackNavigator();

export function ChatsNavigation() { 
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
            <Stack.Screen 
            name ={screens.global.chatScreen}
            component={ChatScreen}
            options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}
