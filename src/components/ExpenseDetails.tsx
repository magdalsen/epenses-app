import { Link, useParams } from "react-router-dom";
import { fetchDataByRow, handleDelete } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { addExpenseIfLabelIsUnique, createPureMonthAndYearDataFormat, expensesGetYear } from "./utils/utils";
import { AddExpenseData, ExpensesData } from "./constans/types";
import style from './ExpenseDetails.module.css';
import { ConfirmButton, SubmitButton } from "./common/Buttons";
import { buttonData } from "./constans/constans";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "./common/Inputs";
import { schemaAddExpense } from "./validation/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";

const ExpenseDetails = () => {
    const { userId }=useUserContext();
    const {id} = useParams();
    const queryClient = useQueryClient();
    const idFormat = id?.replace('-',' ');

    const { register, handleSubmit, formState: { errors } } = useForm<AddExpenseData>({
        defaultValues: {
          expense: '',
          price: 0,
        },
        resolver: yupResolver(schemaAddExpense)
      });
      const onSubmit = (data: AddExpenseData) => {  
        mutation.mutate(data);      
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

    const expensesFilter = () => {
        return expenses.filter((exp:ExpensesData)=>{
            return (createPureMonthAndYearDataFormat(exp)).includes(idFormat);
        }).map((expens:ExpensesData,i: number)=>{                    
            return (
                <>
                        <div>{i+1}</div>
                        <div>{expens.productCategory}</div>
                        <div>{expens.productPrice} zł</div>
                        <div>
                            <Link to={`/expenseDetails/${expens.productLabel}/edit`}>
                                <Button colorScheme="yellow" type="button" >Edit</Button>
                            </Link>
                            <Button colorScheme="red" type="button" onClick={()=>mutationDelete.mutate(expens.productLabel)} >Delete</Button></div>
                </>
            )
        })
    }

    const { data:expenses, isLoading, error } = useQuery({
        queryKey: ['expenses'],
        queryFn: () => fetchDataByRow(userId).then((data)=>{
            return expensesGetYear(data)
        })
    })

    const mutation = useMutation({
        mutationFn: (values:AddExpenseData) => {
          return addExpenseIfLabelIsUnique(values, expenses, idFormat, id, userId);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['expenses'] })
        },
        onError: () => {
          throw new Error("Something went wrong :(");
        }
      })
    
    const mutationDelete = useMutation({
        mutationFn: (value:string) => {
          return handleDelete(value);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['expenses'] })
        },
        onError: () => {
          throw new Error("Something went wrong :(");
        }
      })
  
    if (isLoading) {
      return <div>Loading...</div>
    }
    if (error) {
      return <div>Error! Contact with administrator.</div>
    }

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
                            {expensesFilter()}
                        </div>
                    </div>
                </div>
            </section>
            <Link to={'/'}>
                <ConfirmButton value={buttonData.backButton} />
            </Link>
        </>
    )
}

export default ExpenseDetails
// lazy loading, poprawić buttons i usunąć any, dodać kontekst notyfikacji