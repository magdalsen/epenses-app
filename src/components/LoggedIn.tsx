import { useUserContext } from "../context/UserContext";
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import style from "./LoggedIn.module.css";
import { Link } from "react-router-dom";
import { AddMonthModal } from "./AddMonthModal";
import { IncomeData, ExpensesData } from "./constans/types";
import { fetchDataByRow, fetchUserData } from "../api/api";
import { ConfirmButton } from "./common/Buttons";
import { expensesGetYear, formatDate } from "./utils/utils";
import { buttonData, monthsListed } from "./constans/constans";
import { useQuery } from "@tanstack/react-query";

export const LoggedIn = () => {
    const { logOut, userId }=useUserContext();

    const { data:years, isLoading, error} = useQuery({
        queryKey: ['years'],
        queryFn: () => fetchDataByRow(userId).then((data)=>{
            return formatDate(data)
        })
    })
    const { data:expenses } = useQuery({
        queryKey: ['expenses'],
        queryFn: () => fetchDataByRow(userId).then((data)=>{
            return expensesGetYear(data)
        })
    })
    const { data:income } = useQuery({
        queryFn: () => fetchUserData(userId),
        queryKey: ['income']
    })

    const expensesFilter = (year: number, income: IncomeData) => {
        let max = 0;
            return expenses.map((exp:ExpensesData,i: number,array: string | string[])=>{
                if ((exp.created_at).includes(year.toString()) && (exp.created_at).includes(income.monthName)) {
                    let expSum = max+=exp.productPrice;
                    return <>
                    {i === array.length-1 ? <>
                    <div>{expSum} zł</div><div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
                    <ConfirmButton value={buttonData.detailsButton} />
                    </Link></div>
                    </> : <></>}
                </>
                } else {
                    let expSum = max+=0;
                    return <>
                    {i === array.length-1 ? <>
                    <div>{expSum} zł</div><div><Link to={`/expenseDetails/${income.monthName}-${year.toString()}`}>
                    <ConfirmButton value={buttonData.detailsButton} />
                    </Link></div>
                    </> : <></>}
                    </>
                }
            }
            )
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
                    {years?.map((year)=>(
                        <Tab>{year}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                {years?.map((year)=>(
                    <div className={style.expenseBox_container}>
                        {income?.sort((a, b) => {
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