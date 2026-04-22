import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme } from "native-base";
import { AuthProvider, ThemeProvider } from "./src/context";
import { HandlerNavigation } from "./src/navigations";

const theme = extendTheme({
});

export default function App() {
    return (
        <NativeBaseProvider isSSR={false} theme={theme}>
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
