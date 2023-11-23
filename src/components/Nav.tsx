import { Link } from "react-router-dom"

export const Nav = () => {
    return (
        <>
            <Link to={"/signup"}>
                <button type="button">Zarejestruj się</button>
            </Link>
        </>
    )
}