import { useUserContext } from "../context/UserContext";
import { LoggedIn } from "./LoggedIn";
import { Login } from "./Login"

export const Home = () => {
    const { isLoggedIn }=useUserContext();
    return (
        <>
            {isLoggedIn ? <LoggedIn /> : <Login />}
        </>
    )
}