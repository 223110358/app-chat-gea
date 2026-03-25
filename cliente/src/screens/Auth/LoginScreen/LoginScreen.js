import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { screens } from "../../../Utils";
import { LoginForm } from "../../../components/Auth/LoginForm";
import { styles } from "./LoginScreen.styles";

export function LoginScreen() {
    const navigation = useNavigation();
    const goToRegister = () => {
        navigation.navigate(screens.auth.registerScreen);
    }
    return(
        <View style={styles.content}>
            <Text style={styles.title}>Comienza a chatear en Appchat</Text>
            <LoginForm />
            <Text style={styles.register} onPress={goToRegister}>
                Registrarse
            </Text>
            <Text style={styles.info}>
                La edad minima para ingresar en AppChat es +18.
                Consulta las politicas de privacidad y seguridad de AppChat
            </Text>
        </View>
    )
}