import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";

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
            console.log(userData);
            
            if (error != null) {
                alert('Taki użytkownik już istnieje.');
                throw error;
            };
            if (userData === null) alert('Rejestracja przebiegła pomyślnie!');
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          confirm: ''
        },
        // resolver: yupResolver(schemaSignup)
      });
      const onSubmit = (data: SignupData) => {
        addUser(data);
      }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} type="text" placeholder="Imię" />
            <p>{errors.name?.message}</p>
            <input {...register("email")} type="text" placeholder="E-mail" />
            <p>{errors.email?.message}</p>
            <input {...register("password")} type="password" placeholder="Hasło" />
            <p>{errors.password?.message}</p>
            <input {...register("confirm")} type="password" placeholder="Powtórz hasło" />
            <p>{errors.confirm?.message}</p>
            <button type="submit">Zarejestruj</button>
        </form>
    )
}