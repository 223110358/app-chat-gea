import { map } from "lodash";
import { Avatar, Text, View } from "native-base";
import { ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Chat } from "../../../../api";
import { useAuth, useTheme } from "../../../../hooks";
import { ENV, screens } from "../../../../Utils";
import { createStyles } from "./ListUsers.styles";

const chatController = new Chat();

function navigateFromRoot(navigation, screen, params) {
    let navigator = navigation;
    let parent = navigation.getParent?.();

    while (parent) {
        navigator = parent;
        parent = parent.getParent?.();
    }

    navigator.navigate(screen, params);
}

export function ListUsers(props) {
    const { users } = props;
    const { accessToken } = useAuth();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const navigation = useNavigation();

    const createChat = async (user) => {
        try {
            const chat = await chatController.create(accessToken, user._id);

            if (chat && chat._id && chat.already_exists) {
                navigateFromRoot(navigation, screens.global.chatScreen, {
                    chatId: chat._id,
                    otherUser: user,
                });
                return;
            }

            navigation.navigate(screens.tab.chats.chatsScreen, {
                chatCreated: chat?._id,
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
                    <Avatar
                        bg={colors.primary}
                        marginRight={3}
                        source={{
                            uri: user.avatar && `${ENV.BASE_PATH}/uploads/${user.avatar}`,
                        }}
                    >
                        {user.email.substring(0, 2).toUpperCase()}
                    </Avatar>

                    <View style={styles.userInfo}>
                        <Text style={styles.name}>
                            {user.firstname || user.lastname
                                ? `${user.firstname || ""} ${user.lastname || ""}`
                                : "Sin nombre registrado"}
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
