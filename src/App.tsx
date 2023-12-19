import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ExpenseDetails } from './components/ExpenseDetails';
import { Home } from './components/Home';
import { UserProvider } from './context/UserContext';
import { SignUp } from './components/SignUp';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { EditForm } from './components/EditForm';

const queryClient=new QueryClient({
  queryCache: new QueryCache(),
   defaultOptions: {
      queries: {
        staleTime: 60_000,
        // enabled: useRouter().isReady
      }
    }
})

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools position="top" initialIsOpen={false} />
          )}
        <BrowserRouter>
          <UserProvider>
            <h1>Expenses App</h1>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/expenseDetails/:id" element={<ExpenseDetails />} />
                <Route path="/expenseDetails/:id/edit" element={<EditForm />} />
              </Routes>
          </UserProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
