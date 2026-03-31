import { map } from "lodash";
import { Avatar, Text, View } from "native-base";
import { ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Chat } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, screens } from "../../../../Utils";
import { styles } from "./ListUsers.styles";

const chatController = new Chat();

export function ListUsers(props) {
    const { users } = props;
    const { accessToken } = useAuth();
    const navigation = useNavigation();

    const createChat = async (user) => {
        try {
            const chat = await chatController.create(accessToken, user._id);

            // Si el backend retorna el chat creado, navegamos directo al chat
            if (chat && chat._id) {
                navigation.navigate(screens.global.chatScreen, {
                    chatId: chat._id,
                    otherUser: user,
                });
            } else {
                // fallback: regresar a lista de chats
                navigation.navigate(screens.tab.chats.chatsScreen);
            }
        } catch (error) {
            console.error("Error al crear chat:", error);
        }
    };

    return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {map(users, (user) => (
                <TouchableOpacity
                    key={user._id}
                    onPress={() => createChat(user)}
                    style={styles.item}
                >
                    <Avatar
                        bg="cyan.500"
                        marginRight={3}
                        source={{
                            uri: user.avatar && `${ENV.BASE_PATH}/uploads/${user.avatar}`,
                        }}
                    >
                        {user.email.substring(0, 2).toUpperCase()}
                    </Avatar>

                    <View>
                        <Text style={styles.name}>
                            {user.firstname || user.lastname
                                ? `${user.firstname || ""} ${user.lastname || ""}`
                                : "...."}
                        </Text>

                        <Text style={styles.email}>
                            {user.email}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}