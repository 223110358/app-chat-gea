import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { RegisterForm } from "../../../components/Auth/RegisterForm";
import { useTheme } from "../../../hooks";
import { createStyles } from "./RegisterScreen.styles";

export function RegisterScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.eyebrow}>Nueva cuenta</Text>
                <Text style={styles.title}>Registrate ahora</Text>
                <Text style={styles.info}>Crea tu acceso para comenzar a conversar.</Text>
                <RegisterForm />
                <TouchableOpacity onPress={navigation.goBack} style={styles.linkButton}>
                    <Text style={styles.register}>Iniciar sesion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
