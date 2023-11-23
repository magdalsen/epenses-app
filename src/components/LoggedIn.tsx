import { useUserContext } from "../context/UserContext";

export const LoggedIn = () => {
    const { logOut }=useUserContext();

    return (
        <>
            <button type="submit" onClick={()=>logOut()}>Wyloguj</button>
            <div>Jesteś zalogowany.</div>
        </>
    )
}