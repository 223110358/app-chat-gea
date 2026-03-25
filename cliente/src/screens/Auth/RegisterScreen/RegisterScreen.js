import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { RegisterForm } from "../../../components/Auth/RegisterForm";
import { styles } from "./RegisterScreen.styles";

export function RegisterScreen() {
    const navigation = useNavigation();
    return(
        <View style={styles.content}>
            <Text style={styles.title}>Registrate Ahora</Text>
            <RegisterForm/>
            <Text style={styles.register} onPress={navigation.goBack}>
                Iniciar Sesion
            </Text>
        </View>
    )
}