import { useFormik } from "formik";
import { Button, Input } from "native-base";
import { View } from "react-native";
import { Auth } from "../../../api/auth";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./LoginForm.form";
import { styles } from "./LoginForm.styles";

const authController = new Auth();

export const LoginForm = () => {
    const {login} = useAuth();
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            try {                
                const response = await authController.login(
                    formValue.email,
                    formValue.password
                );
                const { access,refresh } = response;
                await authController.setAccesToken(access)
                await authController.setRefreshToken(refresh)
                await login(access);
            }catch (error) {
                console.log(error);
            }
        }
    })
    return (
        <View style={styles.viewInput}>
            <Input
            placeholder="Email" 
            variant="unstyled"
            autoCapitalize="none"
            value={formik.values.email}
            onChangeText={(text)=>formik.setFieldValue("email",text)}
             style={[styles.input, formik.errors.email && styles.inputError]} 
            />
            <Input 
            placeholder="Password" 
            variant="unstyled"
            secureTextEntry
            value={formik.values.password}
            onChangeText={(text)=>formik.setFieldValue("password",text)}
            autoCapitalize="none"
            style={[styles.input, formik.errors.password && styles.inputError]}
            />
            <Button style={styles.btn} onPress={() => formik.handleSubmit()} isLoading={formik.isSubmitting} >Iniciar sesión</Button>
        </View>
    );
}