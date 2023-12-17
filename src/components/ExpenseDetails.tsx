import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDataByRow } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { addExpenseIfLabelIsUnique, expensesGetYear } from "./utils/utils";
import { AddExpenseData } from "./constans/types";
import style from './ExpenseDetails.module.css';
import { ConfirmButton, SubmitButton } from "./common/Buttons";
import { buttonData } from "./constans/constans";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "./common/Inputs";
import { schemaAddExpense } from "./validation/validation";
import { EditForm } from "./EditForm";

export const ExpenseDetails = () => {
    const { userId }=useUserContext();
    const {id} = useParams();
    const [expenses, setExpenses] = useState([]);
    const idFormat = id?.replace('-',' ');

    const { register, handleSubmit, formState: { errors } } = useForm<AddExpenseData>({
        defaultValues: {
          expense: '',
          price: 0,
        },
        resolver: yupResolver(schemaAddExpense)
      });
      const onSubmit = (data: AddExpenseData) => {
        addExpenseIfLabelIsUnique(data, expenses, idFormat, id, userId);        
      }

    const inputData = {
        expenseData: {
          type: "text",
          text: "Expense",
          register: {...register("expense")}
        },
        priceData: {
            type: "number",
            text: "Price",
            register: {...register("price")}
          }
      }

    useEffect(()=>{
        fetchDataByRow(userId).then((data)=>{
            setExpenses(expensesGetYear(data));
        });
    },[]);

    return (
        <>
            <h2>Details for {idFormat}</h2>
            <section className={style.expensesBox}>
                <div>
                    <h3>Add expense</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3>Add expense category:</h3>
                        <InputField value={inputData.expenseData} />
                        <p>{errors.expense?.message}</p>
                        <h3>Add price:</h3>
                        <InputField value={inputData.priceData} />
                        <p>{errors.price?.message}</p>
                        <SubmitButton value={buttonData.addButton} />
                    </form>
                </div>
                <div>
                    <h3>Your expenses</h3>
                    <div>
                        <div className={style.container}>
                            <div>Id</div>
                            <div>Category</div>
                            <div>Price</div>
                            <div>Buttons</div>
                        </div>
                        <EditForm />
                    </div>
                </div>
            </section>
            <Link to={'/'}>
                <ConfirmButton value={buttonData.backButton} />
            </Link>
        </>
    )
}