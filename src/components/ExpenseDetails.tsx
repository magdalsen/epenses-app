import { useParams } from "react-router-dom";

export const ExpenseDetails = () => {
    const {id} = useParams();
    return (
        <>
            Exp det: {id}
        </>
    )
}