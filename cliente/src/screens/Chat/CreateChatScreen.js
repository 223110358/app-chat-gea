import { useNavigation } from "@react-navigation/native";
import { CloseIcon, IconButton } from "native-base";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { User } from "../../api";
import { CreateChat, Search } from "../../components/Chat";
import { useAuth, useTheme } from "../../hooks";

const userController = new User();

export function CreateChatScreen() {
    const navigation = useNavigation();
    const { accessToken } = useAuth();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [users, setUsers] = useState(null);
    const [usersResult, setUserResult] = useState(null);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon={<CloseIcon />}
                    padding={5}
                    onPress={navigation.goBack}
                />
            ),
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            try {
                const response = await userController.getAll(accessToken);
                setUsers(response);
                setUserResult(response);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [accessToken]);

    if (!usersResult) return null;

    return (
        <View style={styles.container}>
            <Search data={users} setData={setUserResult} />
            <CreateChat.ListUsers users={usersResult} />
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
