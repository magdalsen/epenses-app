import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";
import { Button, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "./Signup.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaSignup } from "./validation/validation";

interface SignupData {
    name: string;
    email: string;
    password: string;
    confirm: string;
}

export const SignUp = () => {

    const addUser = async (values:SignupData) => {
        const { name, email, password } = values;
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) throw error;
        if (data && data.user) {
            const { data:userData, error } = await supabase
            .from('users')
            .insert([
              { id: data.user?.id, name, email }
            ])
            if (error != null) {
                alert('User already exist.');
                throw error;
            };
            if (userData === null) alert('Success! Account created!');
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          confirm: ''
        },
        resolver: yupResolver(schemaSignup)
      });
      const onSubmit = (data: SignupData) => {
        addUser(data);
      }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Sign up</h2>
            <Input {...register("name")} type="text" placeholder="Name" />
            <p>{errors.name?.message}</p>
            <Input {...register("email")} type="text" placeholder="E-mail" />
            <p>{errors.email?.message}</p>
            <Input {...register("password")} type="password" placeholder="Password" />
            <p>{errors.password?.message}</p>
            <Input {...register("confirm")} type="password" placeholder="Repeat password" />
            <p>{errors.confirm?.message}</p>
            <Button colorScheme='blue' variant='solid' type="submit">Sign up</Button>
            <Link to={'/'}>
                <Button colorScheme='blue' variant='outline' type="submit">Back</Button>
            </Link>
        </form>
    )
}