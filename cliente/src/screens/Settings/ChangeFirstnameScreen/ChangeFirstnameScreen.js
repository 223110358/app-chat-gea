import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { Button, Input } from "native-base";
import { View } from "react-native";
import { User } from "../../../api";
import { useAuth } from "../../../hooks";
import { styles } from "./ChangeFirstnameScreen.styles";
import { initialValues, validationSchema } from "./ChangeFirstnamesScreen.form";

const userController = new User();

export function ChangeFirstnameScreen() {
    const navigation = useNavigation();
    const { accessToken, updateUser } = useAuth(); 
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit:async (formValue) => {
            try {
                const dataUser = {firstname: formValue.firstname};
                await userController.updateUser(accessToken, dataUser);
                updateUser("firstname", formValue.firstname);
                navigation.goBack();
            }
            catch (error) {                
                console.error(error);
            }
        }
    });

    return(
        <View style={styles.content}>
            <Input 
            placeholder="Escribe tu nombre" 
            style={[styles.input]}
            variant="unstyled"
            autoFocus
            value={formik.values.firstname}
            onChangeText={(text) => formik.setFieldValue("firstname", text)}
            />
            <Button style={styles.btn} 
            onPress={formik.handleSubmit} 
            isLoading={formik.isLoading} 
            >
                Cambiar nombre</Button>
        </View>
    )
}
