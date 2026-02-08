  import { useState } from 'react'
  import { firstGreater } from './utils.js'
  import { onChange } from 'react'
function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState("")
  let a = 7;
  let b = 10;

  return (
    <>
      <input type = "text"
      value = {text}
      onChange={e => setText(e.target.value)}
      placeholder=""
      />
      <p> {text} </p>
      


      <div> 
        <p> a is greater than b: {firstGreater (a, b).toString()}</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
