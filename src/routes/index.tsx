import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '../pages/LandingPage'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { TaskManager } from '../pages/TaskManager'
import { useAuth } from '../contexts/AuthContext'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TaskManager /></PrivateRoute>} />
    </Routes>
  )
}