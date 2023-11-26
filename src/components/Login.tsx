import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";
import { useUserContext } from "../context/UserContext";
import { Button, Input } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaLogin } from "./validation/validation";
import style from "./Login.module.css";

interface LoginData {
    email: string;
    password: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const { setIsLogged, setId }=useUserContext();

    const loginUser = async (values:LoginData) => {
        const { email, password } = values;
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) alert('Błąd logowania.');
        if (data.user) {
            alert(`Witaj ${email}!`);
            setIsLogged(true);
            setId(data.user.id);
            navigate('/');
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        defaultValues: {
          email: '',
          password: '',
        },
        resolver: yupResolver(schemaLogin)
      });
      const onSubmit = (data: LoginData) => {
        loginUser(data);
      }

    return (
        <>
            <Link to={"/signup"}>
                <Button colorScheme='blue' variant='solid' type="button">Sign up</Button>
            </Link>
            <h2>Sign in</h2>
            <section className={style.loginForm}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>E-mail</h3>
                    <Input {...register("email")} type="text" placeholder="E-mail" />
                    <p>{errors.email?.message}</p>
                    <h3>Password</h3>
                    <Input {...register("password")} type="password" placeholder="Password" />
                    <p>{errors.password?.message}</p>
                    <Button colorScheme='blue' variant='solid' type="submit">Login</Button>
                </form>
            </section>
        </>
    )
}
