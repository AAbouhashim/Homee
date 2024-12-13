import { Route, Routes } from "react-router-dom"

import Navbar from './components/pageComponents/Navbar.jsx'
import Home from './pages/home/HomePage.jsx'
import LogInPage from './pages/auth/login/LogInPage.jsx'
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx"

function App() {
  return (
    <div className='flex flex-col'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default App
