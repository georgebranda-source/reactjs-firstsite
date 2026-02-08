import { useState } from "react";
import ChinaExports from './components/ChinaExports.jsx';

function App() {
  const [range, setRange] = useState("1y");
  console.log("Range in App:", range);

  return (
      <div>
        <h1> Canada-China Trade Dashboard </h1>    

        <label>
          Select range:{" "}
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="1y">Past Year</option>
            <option value="5y">Past 5 Years</option>
            <option value="10y">Past 10 Years</option>
            <option value="all">All Available Data</option>
          </select>
        </label>

        <ChinaExports range={range} />
      </div>
  )
}

export default App