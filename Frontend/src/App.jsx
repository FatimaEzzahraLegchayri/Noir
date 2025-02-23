import FloatingShape from "./Components/FloatingShape"

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br
      from-blue-900 via-em-900 to-rose-900 flex items-center justify-center relative overflow-hidden">

      <FloatingShape color='bg-gray-400' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-gray-300' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-gray-400' size='w-32 h-32' top='40%' left='-10%' delay={2} />
    </div>
  )
}

export default App
