import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { AuthProvider, ThemeProvider } from "./src/context";
import { HandlerNavigation } from "./src/navigations";

export default function App() {
    return (
        <NativeBaseProvider>
            <ThemeProvider>
                <NavigationContainer>
                    <AuthProvider>
                         <HandlerNavigation />
                    </AuthProvider>
                </NavigationContainer>
            </ThemeProvider>
        </NativeBaseProvider>
    );
}
