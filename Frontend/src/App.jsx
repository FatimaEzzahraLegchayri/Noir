import { Route, Routes, Navigate } from "react-router-dom"
import {Toaster} from 'react-hot-toast'
import { useEffect } from "react"

import FloatingShape from "./Components/FloatingShape"
import SignUp from "./Pages/SignUp"
import Login from "./Pages/Login.jsx"
import EmailVerification from "./Pages/EmailVerification.jsx"
import useAuthStore from './Store/AuthStore.js'
import ProfilePage from './Pages/ProfilePage.jsx'
import LoadingSpinner from './Components/LoadingSpinner.jsx'
import ForgetPassword from './Pages/ForgetPassword.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'


// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user?.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	if (isAuthenticated && user?.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


function App() {
  const {checkAuth, isCheckingAuth } = useAuthStore()

	useEffect(() => {
        checkAuth();
	}, [checkAuth]);

	if(isCheckingAuth) return <LoadingSpinner />
 
  return (
    <div className="min-h-screen bg-gradient-to-br
      from-blue-900 via-em-900 to-rose-900 flex items-center justify-center relative overflow-hidden">

      <FloatingShape color='bg-gray-400' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-gray-300' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-gray-400' size='w-32 h-32' top='40%' left='-10%' delay={2} />
    
      <Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUp />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerification />} />
				<Route path='/forgot-password' 
					element={
						<RedirectAuthenticatedUser>
							<ForgetPassword />
						</RedirectAuthenticatedUser>
					} 
				/>
				<Route
					path='/reset-password'
					element={
						<RedirectAuthenticatedUser>
							<ResetPassword />
						</RedirectAuthenticatedUser>
					}
				/>
				
				<Route path='*' element={<Navigate to='/' replace />} />
			
			</Routes>
    
      <Toaster />

    </div>
  )
}

export default App
