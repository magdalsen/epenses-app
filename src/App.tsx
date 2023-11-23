import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <>
      <UserProvider>
        <h1>Expenses App</h1>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
