import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { assets } from "../../../assets";
import { useTheme } from "../../../hooks";
import { screens } from "../../../Utils";
import { createStyles } from "./AuthStartScreen.style.js";

export function AuthStartScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const goToLogin = () => {
        navigation.navigate(screens.auth.loginScreen);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.content}>
                <Image source={assets.image.jpg.auth01} style={styles.img} />
                <View style={styles.copy}>
                    <Text style={styles.eyebrow}>AppChat</Text>
                    <Text style={styles.title}>Te damos la bienvenida</Text>
                    <Text style={styles.description}>
                        Conversa con tu equipo y mantén tus chats organizados.
                    </Text>
                    <TouchableOpacity style={styles.btn} onPress={goToLogin}>
                        <Text style={styles.btnText}>Aceptar y continuar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
