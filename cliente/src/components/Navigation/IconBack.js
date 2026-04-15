import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, IconButton } from "native-base";
import { useTheme } from "../../hooks";
export function IconBack() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    return (
        <IconButton 
            icon={<ChevronLeftIcon 
                color={colors.text}
                padding={0}  />}
            onPress={() => navigation.goBack()}
        />
        
    );
}
