import * as yup from "yup";

export const schemaLogin = yup.object({
    email: yup.string().email('Invalid email').required('E-mail required!'),
    password: yup.string()
      .min(8, 'Password must be 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
    //   .matches(/[^\w]/, 'Password requires a symbol')
      .required('Password required!')
  }).required();

  export const schemaSignup = yup.object({
    name: yup.string().min(3, 'Min. 3 chars!').required("Name required!"),
    email: yup.string().email('Invalid email').required('E-mail required!'),
    password: yup.string()
      .min(8, 'Password must be 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol')
      .required('Password required!'),
    confirm: yup.string()
      .oneOf([yup.ref('password')], 'Must match "password" field value')
      .required('Confirm password required!'),
  }).required();

  export const schemaAddMonth = yup.object({
    income: yup.number().positive().required(),
    month: yup.string().required("Please select a month"),
  }).required();