import { useState } from 'react'


const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="flex justify-center">
      <button className="text-9xl rounded-2xl border border-amber-500" onClick={() => setCount(count + 1)}> Blah blah {count}</button>
    </div>
  )
}

export default App
