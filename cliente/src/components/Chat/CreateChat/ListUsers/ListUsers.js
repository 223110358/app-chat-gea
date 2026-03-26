import { map } from "lodash";
import { Avatar, Text, View } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { ENV, screens } from "../../../../Utils";
import { Chat } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { styles } from './ListUsers.styles';

const chatController = new Chat();

export function ListUsers(props) {
    const { users } = props;
    const navigation = useNavigation();
    const { accessToken, user } = useAuth();

    const createChat = async (otherUser) => {
    try {
        const chat = await chatController.create(
            accessToken,
            user._id,
            otherUser._id
        );
        console.log("Chat response:", chat); // ← verifica qué llega
        if (!chat._id) {
            console.error("El chat no tiene _id:", chat);
            return;
        }
        navigation.navigate(screens.global.chatScreen, {
            chatId: chat._id,
            otherUser: otherUser,
        });
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
                    <Avatar bg="cyan.500" marginRight={3} source={{ uri: user.avatar && `${ENV.BASE_PATH}/uploads/${user.avatar}` }}>
                        {user.email.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <View>
                        <Text style={styles.name}>
                            {user.firstname || user.lastname ? `${user.firstname} ${user.lastname || ""}` : "...."}
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