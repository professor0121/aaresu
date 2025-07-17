import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/LoginPage'
import Home from '../pages/HomePage'
import ProtectedRoute from '@/components/ProtectedRoute'


const RootRoutes = () => {

  return (
    <div
      style={{
        backgroundImage: 'url(gradient_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Routes >
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default RootRoutes