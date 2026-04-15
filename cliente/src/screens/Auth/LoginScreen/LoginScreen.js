import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { LoginForm } from "../../../components/Auth/LoginForm";
import { useTheme } from "../../../hooks";
import { screens } from "../../../Utils";
import { createStyles } from "./LoginScreen.styles";

export function LoginScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const goToRegister = () => {
        navigation.navigate(screens.auth.registerScreen);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.eyebrow}>AppChat</Text>
                <Text style={styles.title}>Comienza a chatear</Text>
                <Text style={styles.info}>
                    Ingresa con tu correo para ver tus conversaciones.
                </Text>
                <LoginForm />
                <TouchableOpacity onPress={goToRegister} style={styles.linkButton}>
                    <Text style={styles.register}>Crear cuenta</Text>
                </TouchableOpacity>
                <Text style={styles.legal}>
                    La edad minima para ingresar en AppChat es +18.
                </Text>
            </View>
        </View>
    );
}
