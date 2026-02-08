import { use, useEffect, useState } from "react";
import Chart from './components/Chart.jsx';
import { fetchVector, normalizeMatrix, sourceData } from './utils.js';

function App() {
  const [range, setRange] = useState("2y");
  const [indicator, setIndicator] = useState("aggregate");
  const [data, setData] = useState([]);
  const [realMatrix, setRealMatrix] = useState([]);
  const [normalizedMatrix, setNormalizedMatrix] = useState([]);

  {/* Initial data load on component mount */}
  useEffect(() => {
    async function load() {
      const chinaImports =  await fetchVector("China", "imports", "all");
      const chinaExports =  await fetchVector("China", "exports", "all");
      const usImports =  await fetchVector("US", "imports", "all");
      const usExports =  await fetchVector("US", "exports", "all");
      const euImports =  await fetchVector("EU", "imports", "all");
      const euExports =  await fetchVector("EU", "exports", "all");
      const ukImports =  await fetchVector("UK", "imports", "all");
      const ukExports =  await fetchVector("UK", "exports", "all");
      const mexicoImports =  await fetchVector("Mexico", "imports", "all");
      const mexicoExports =  await fetchVector("Mexico", "exports", "all");
      setData({chinaImports, chinaExports, usImports, usExports, euImports, euExports, ukImports, ukExports, mexicoImports, mexicoExports});
    }
    load();
  }, []);

  {/* Once data is initialized, update data whenever indicator or range is set */}
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setRealMatrix(sourceData({indicator, range, data}));
      setNormalizedMatrix(normalizeMatrix(sourceData({indicator, range, data})));
    }
  }, [indicator, range, data]);

  {/* Debugging: log data updates */}
  useEffect(() => {
    console.log("Data updated: ", realMatrix);
  }, [realMatrix]);

  return (
      <div>
        <h1> Canadian Trade Dashboard </h1>    

        <label>
          Select range:{" "}
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="1y">Past Year</option>
            <option value="2y">Past 2 Years</option>
            <option value="5y">Past 5 Years</option>
            <option value="10y">Past 10 Years</option>
            <option value="all">All Available Data</option>
          </select>
        </label>

        <label>
          Select indicator:{" "}
          <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>
            <option value="aggregate">Aggregate</option>
            <option value="exports">Exports</option>
            <option value="imports">Imports</option>
          </select>
        </label>

        <h2> Normalized trade Data </h2>
        <Chart data={normalizedMatrix} />
        <h2> Real Trade Data </h2>
        <Chart data={realMatrix} />
      </div>
  )
}

export default App