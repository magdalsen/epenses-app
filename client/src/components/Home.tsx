import { useUserContext } from "../context/UserContext";
import { LoggedIn } from "./LoggedIn";
import { Login } from "./Login"

export const Home = () => {
    const { getToken }=useUserContext();
    const token = getToken();

    return (
        <>
            {token ? <LoggedIn /> : <Login />}
        </>
    )
}