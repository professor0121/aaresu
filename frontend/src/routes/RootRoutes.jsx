import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/LoginPage'
import Register from '../pages/RegisterPage'
import Home from '../pages/HomePage'
import ForgetPassword from '../pages/ForgetPassword'

const RootRoutes = () => {
  return (
    <div
    style={{backgroundImage: 'url(gradient_1.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    }}
    >
    <Routes >
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/forget-password' element={<ForgetPassword/>}/>
    </Routes>
    </div>
  )
}

export default RootRoutes