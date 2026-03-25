import * as yup from "yup";

export function initialValues() {
    return{
        email:"",
        password:"",
    }
}
export function validationSchema(){
    return yup.object({
        email:yup.string().email(true).required(true),
        password:yup.string().required(true),
    })
}