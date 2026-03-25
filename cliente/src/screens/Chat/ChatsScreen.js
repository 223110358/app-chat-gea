import { useNavigation } from "@react-navigation/native";
import { AddIcon, IconButton } from "native-base";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { screens } from "../../Utils";

export function ChatsScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton 
                icon={<AddIcon  />} 
                padding={5} 
                onPress={()=>navigation.navigate(screens.tab.chats.createChatScreen)}/>
            )
        });
    });
    return(
        <View>
            <Text style={{color:"#ffffff"}}>ChatsScreen</Text>
        </View>
    )
}
