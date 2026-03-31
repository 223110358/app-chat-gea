// src/components/Chat/ChatList/ChatItem.js
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ENV, screens } from "../../../Utils";

export function ChatItem({ chat, currentUserId }) {
    const navigation = useNavigation();

    /**
     * El backend popula ambos participantes.
     * Determinamos quién es el "otro" comparando _id con el usuario actual.
     * Esto es necesario porque el chat puede tener al usuario como participant_one O participant_two.
     */
    const otherUser =
        chat.participant_one._id === currentUserId
            ? chat.participant_two
            : chat.participant_one;

    const avatarUri = otherUser.avatar
        ? `${ENV.BASE_PATH}/${otherUser.avatar}`
        : null;

    const handlePress = () => {
        navigation.navigate(screens.global.chatScreen, { chatId: chat._id, userId: otherUser._id });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            {/* Avatar del otro participante */}
            <View style={styles.avatarWrapper}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarLetter}>
                            {otherUser.firstname?.[0]?.toUpperCase() ?? "?"}
                        </Text>
                    </View>
                )}
            </View>

            {/* Nombre del contacto */}
            <View style={styles.info}>
                <Text style={styles.name}>
                    {otherUser.firstname} {otherUser.lastname}
                </Text>
                <Text style={styles.email}>{otherUser.email}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    avatarWrapper: {
        marginRight: 14,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#1a4705",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarLetter: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
    },
    info: {
        flex: 1,
    },
    name: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    email: {
        color: "#888888",
        fontSize: 13,
        marginTop: 2,
    },
});