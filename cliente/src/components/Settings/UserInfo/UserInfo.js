import { Avatar } from "native-base";
import { Text, View } from "react-native";
import { useTheme } from "../../../hooks";
import { ENV } from "../../../Utils";
import { createStyles } from "./UserInfo.styles";

export function UserInfo(props) {
    const { user } = props;
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();

    return (
        <View style={styles.content}>
            <Avatar
                bg={colors.primary}
                size="xl"
                style={styles.avatar}
                source={{
                    uri: user.avatar && `${ENV.BASE_PATH}/uploads/${user.avatar}`,
                }}
            >
                {user.email.substring(0, 2).toUpperCase()}
            </Avatar>
            <Text style={styles.identify}>
                {fullName || "Perfil sin nombre"}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
        </View>
    );
}
