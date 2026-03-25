import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconBack } from "../../components/Navigation";
import { AuthStartScreen, LoginScreen, RegisterScreen } from "../../screens/Auth";
import { screens } from "../../Utils";
import { styles } from "../Styles.styles";
const Stack = createNativeStackNavigator();

export function AuthNavigation() {
    return(
        <Stack.Navigator
        screenOptions={{headerLeft:IconBack,
            contentStyle:styles.stackContent,
            headerStyle:styles.stackHeader,
            headerTitleStyle:styles.stackHeaderTitle
        }}>
            <Stack.Screen 
            name ={screens.auth.authStartScreen}
            component={AuthStartScreen}
            options={{headerShown:false}}
            /> 
            <Stack.Screen 
            name ={screens.auth.loginScreen}
            component={LoginScreen}
            options={{title:"Iniciar sesion"}}
            />
            <Stack.Screen 
            name ={screens.auth.registerScreen}
            component={RegisterScreen}
            options={{title:"Registro"}}
            />
        </Stack.Navigator>
        
    )
}