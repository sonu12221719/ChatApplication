import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import PrivateRoute from './context/PrivateRoute'
import { ChatProvider } from './context/ChatContext'


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Private Route for ChatPage */}
        <Route
          path='/'
          element={
          <PrivateRoute>
            <ChatProvider>
              <ChatPage />
            </ChatProvider>
          </PrivateRoute>
          } />
      </Routes>
    </>
  )
}

export default App