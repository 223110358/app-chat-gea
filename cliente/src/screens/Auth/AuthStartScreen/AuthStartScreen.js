import { useNavigation } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { assets } from "../../../assets";
import { screens } from "../../../Utils";
import { styles } from "./AuthStartScreen.style.js";

export function AuthStartScreen() {
    const navigation = useNavigation();
    const goToLogin = ()=>{
        navigation.navigate(screens.auth.loginScreen)
    }
    return(
        <SafeAreaView styles={styles.content}>
          <Image source={assets.image.jpg.auth01} style={styles.img}/>
          <View>
            <Text style={styles.title}>Te damos la bienvenida a Appchat</Text>
            <Text style={styles.description}>Toda la informacion proporcionada en App chat es propiedad de la misma</Text>
            <Text style={styles.description}>Consulta los yterminos y condiciones de privacidad 
                Pulsa "Aceptar" y continuar los terminos y condiciones 
                </Text>
            <Text style={styles.btn} onPress={goToLogin}>Aceptar y continuar</Text>
          </View>
        </SafeAreaView>
    )
}