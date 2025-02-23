import { Route, Routes } from "react-router-dom"


import FloatingShape from "./Components/FloatingShape"
import SignUp from "./Pages/SignUp"
import Login from "./Pages/Login.jsx"

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br
      from-blue-900 via-em-900 to-rose-900 flex items-center justify-center relative overflow-hidden">

      <FloatingShape color='bg-gray-400' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-gray-300' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-gray-400' size='w-32 h-32' top='40%' left='-10%' delay={2} />
    
    <Routes>
      <Route path="/" element={'home'}/>
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/login" element={<Login/>}/>
    </Routes>
    
    
    </div>
  )
}

export default App
