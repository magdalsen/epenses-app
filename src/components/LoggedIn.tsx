import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import style from "./LoggedIn.module.css";
import { Link } from "react-router-dom";
import { AddMonthModal } from "./AddMonthModal";
import { IncomeData, ExpensesData } from "./constans/types";
import { fetchDataByRow, fetchUserData } from "../api/api";
import { ConfirmButton } from "./common/Buttons";
import { expensesGetYear, formatDate } from "./utils/utils";
import { buttonData } from "./constans/constans";

export const LoggedIn = () => {
    const { logOut, userId }=useUserContext();
    const [income, setIncome] = useState<IncomeData[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [expenses, setExpenses] = useState([]);

    const expensesFilter = (year: number, income: IncomeData, sum: number) => {
        return expenses.filter((exp:ExpensesData)=>
                    (exp.created_at).includes(year.toString()) && (exp.created_at).includes(income.monthName)
                ).map((exp:ExpensesData,i,array)=>{
                    let expSum = sum += exp.productPrice;
                    return <>
                        {i === array.length-1 ? <>
                            <>{expSum} zł</>
                            <div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
                                <ConfirmButton value={buttonData.detailsButton} />
                            </Link></div>
                            </> : <></>}
                    </>
                })
    }

    const expensesNullFilter = (year: number, income: IncomeData) => {
        return expenses.filter((exp:ExpensesData)=>
                    {
                        const sliced = (exp.created_at).split(" ");
                        const yearMerged = sliced[0] + " " + sliced[2];
                        return !(yearMerged).includes(income.monthName + " " + year.toString())
                    }
                ).map((_exp:ExpensesData,i,array)=>{
                    return (
                        <>
                            <>{i === array.length-1 ? <>
                                <>0 zł</>
                                <div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
                                    <ConfirmButton value={buttonData.detailsButton} />
                                </Link></div>
                                </> : <></>}</>
                        </>
                    )
                })
    }

    useEffect(()=>{
        fetchUserData(userId).then((data)=>setIncome(data));
        fetchDataByRow(userId).then((data)=>{
            setYears(formatDate(data));
            setExpenses(expensesGetYear(data));
        })
    },[]);

    return (
        <>
            <AddMonthModal />
            <Button colorScheme='blue' variant='outline' type="submit" onClick={()=>logOut()}>Logout</Button>
            <div>You are logged in.</div>

            <Tabs variant='enclosed' maxW='800px'>
                <TabList>
                    {years.map((year)=>(
                        <Tab>{year}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                {years.map((year)=>(
                    <div className={style.expenseBox_container}>
                        {income.filter((el:IncomeData)=>
                                el.year === year
                        ).map((income:IncomeData)=>{
                            let sum = 0;
                            return (
                                <div className={style.expenseBox}>
                                    <TabPanel>
                                        <div>{income.monthName}</div>
                                        <div>Income: {income.monthIncome} zł</div>
                                        <div>Expenses: {expensesFilter(year, income, sum)}
                                                       {expensesNullFilter(year, income)}</div>
                                    </TabPanel> 
                                </div>
                            )
                        })}
                    </div>
                ))}
                </TabPanels>
            </Tabs>
        </>
    )
}