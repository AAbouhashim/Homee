import { Route, Routes } from "react-router-dom"

import Navbar from './components/pageComponents/Navbar.jsx'
import Home from './pages/HomePage.jsx'
import LogInPage from './pages/auth/LogInPage.jsx'
import SignUpPage from "./pages/auth/SignUpPage.jsx"
import MyAccount from "./pages/MyAccount.jsx"
import About from "./pages/About.jsx"
import SupportUs from "./pages/SupportUs.jsx"
import Notifications from "./pages/Notifications.jsx"
import NewPost from "./pages/NewPost.jsx"

function App() {

  return (
    <div className='flex flex-col'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/support-us" element={<SupportUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/newPost" element={<NewPost />} /> 
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App;