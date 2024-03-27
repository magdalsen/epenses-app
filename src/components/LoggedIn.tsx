import { useUserContext } from "../context/UserContext";
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import style from "./LoggedIn.module.css";
import { Link } from "react-router-dom";
import { AddMonthModal } from "./AddMonthModal";
import { IncomeData, ExpensesData } from "./constans/types";
import { fetchDataByRow, fetchUserData } from "../api/api";
import { ConfirmButton } from "./common/Buttons";
import { expensesGetYear } from "./utils/utils";
import { buttonData, monthsListed } from "./constans/constans";
import { useQuery } from "@tanstack/react-query";
import { useNotificationContext } from "../context/NotificationContext";

export const LoggedIn = () => {
    const { toggleAlertError } = useNotificationContext();
    const { logOut, userId }=useUserContext();

    const { data:expenses, isLoading, error } = useQuery({
        queryKey: ['expenses'],
        queryFn: () => fetchDataByRow(userId, toggleAlertError).then((data)=>{
            return expensesGetYear(data)
        })
    })
    const { data:income } = useQuery({
        queryFn: () => fetchUserData(userId, toggleAlertError),
        queryKey: ['income']
    })
    
    const removeDuplicatedData = (years:IncomeData[]) => {
        const arr: number[] = [];
        years?.map((el)=>{
            arr.push(el.year)
        })
        return [...new Set(arr)]
    }

    const expensesFilter = (year: number, income: IncomeData) => {
        let max = 0;
        if (expenses.length === 0) {
            return <>
            <div className={style.boxAvailable}>0 zł</div><div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
            <ConfirmButton value={buttonData.detailsButton} />
            </Link></div>
            </>
        } else if (expenses.length > 0) {
            return expenses?.map((exp:ExpensesData,i: number,array: string | string[])=>{
                if ((exp.created_at).includes(year.toString()) && (exp.created_at).includes(income.monthName)) {
                    let expSum = max+=exp.productPrice;
                    arr.push(expSum);
                    return <>
                    {i === array.length-1 && expSum <= filter[1] && expSum >= filter[0] ? <>
                    <div className={style.boxAvailable}>{expSum} zł</div><div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
                    <ConfirmButton value={buttonData.detailsButton} />
                    </Link></div>
                    </> : <></>}
                </>
                } else {
                    let expSum = max+=0;
                    return <>
                    {i === array.length-1 && expSum <= filter[1] && expSum >= filter[0] ? <>
                    <div className={style.boxAvailable}>{expSum} zł</div><div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
                    <ConfirmButton value={buttonData.detailsButton} />
                    </Link></div>
                    </> : <></>}
                    </>
                }
            }
            )
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error! Contact with administrator.</div>
    }

    return (
        <>
            <AddMonthModal />
            <Button colorScheme='blue' variant='outline' type="submit" onClick={()=>logOut()}>Logout</Button>
            <div>You are logged in.</div>

            <Tabs variant='enclosed' maxW='800px'>
                <TabList>
                    {removeDuplicatedData(income)?.map((year)=>(
                        <Tab>{year}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                {removeDuplicatedData(income)?.map((year)=>(
                    <div className={style.expenseBox_container}>
                        {income?.sort((a: { monthName: string; }, b: { monthName: string; }) => {
                            return monthsListed.indexOf(a.monthName) - monthsListed.indexOf(b.monthName);
                        }).filter((el:IncomeData)=>
                                el.year === year
                        ).map((income:IncomeData)=>{
                            return (
                                <div className={style.expenseBox}>
                                    <TabPanel>
                                        <div>{income.monthName}</div>
                                        <div>Income: {income.monthIncome} zł</div>
                                        <div>Expenses: {expensesFilter(year, income)}</div>
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