import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ExpenseDetails } from './components/ExpenseDetails';
import { Home } from './components/Home';
import { UserProvider } from './context/UserContext';
import { SignUp } from './components/SignUp';

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <h1>Expenses App</h1>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/expenseDetails/:id" element={<ExpenseDetails />} />
            </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App
