import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "./src/context";
import { HandlerNavigation } from "./src/navigations";

export default function App() {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <AuthProvider>
                     <HandlerNavigation />
                </AuthProvider>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}