import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { Button, Input } from "native-base";
import { View } from "react-native";
import { User } from "../../../api";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeLastnameScreen.form";
import { styles } from "./ChangeLastnameScreen.styles";

const userController = new User();

export function ChangeLastnameScreen() {
    const navigation = useNavigation();
    const { accessToken, updateUser } = useAuth();
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
        try {
            await userController.updateUser(accessToken, formValue);
            updateUser("lastname",formValue.lastname)
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
                placeholder="Ingresa tu apellido"
                variant="unstyled"
                autoFocus
                value={formik.values.lastname}
                onChangeText={(text)=>formik.setFieldValue("lastname",text)}
                style={[styles.input,formik.errors.lastname && styles.error]}
            />
            <Button style={styles.btn} 
            onPress={formik.handleSubmit}
            isLoading={formik.isSubmitting}>
                Actualizar apellido
            </Button>
        </View>
    )
}
