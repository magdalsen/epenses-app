import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";
import { useUserContext } from "../context/UserContext";

interface LoginData {
    email: string;
    password: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const { setIsLogged }=useUserContext();

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
            navigate('/');
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        defaultValues: {
          email: '',
          password: '',
        },
        // resolver: yupResolver(schemaSignup)
      });
      const onSubmit = (data: LoginData) => {
        loginUser(data);
      }

    return (
        <>
            <Link to={"/signup"}>
                <button type="button">Zarejestruj się</button>
            </Link>
            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Logowanie</h2>
                    <h3>E-mail</h3>
                    <input {...register("email")} type="text" placeholder="E-mail" />
                    <p>{errors.email?.message}</p>
                    <h3>Hasło</h3>
                    <input {...register("password")} type="password" placeholder="Hasło" />
                    <p>{errors.password?.message}</p>
                    <button type="submit">Zaloguj</button>
                </form>
            </section>
        </>
    )
}