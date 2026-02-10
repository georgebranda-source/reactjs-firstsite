import { use, useEffect, useState } from "react";
import Chart from './components/Chart.jsx';
import { load, normalizeMatrix, sourceData } from './utils.js';
import "./App.css";
import sourceinfo from "./assets/sourceinfo.txt?raw";
import motivation from "./assets/motivation.txt?raw";
import beaver from './assets/beaver.png';
import loonie from './assets/loonie.png';

function App() {
  const [currentTab, setCurrentTab] = useState("home");

  const [data, setData] = useState([]);
  const [realMatrix, setRealMatrix] = useState([]);
  const [normalizedMatrix, setNormalizedMatrix] = useState([]);

  const [range, setRange] = useState("2y");
  const [indicator, setIndicator] = useState("aggregate");
  const [showChina, setShowChina] = useState(true);
  const [showUS, setShowUS] = useState(true);
  const [showEU, setShowEU] = useState(true);
  const [showUK, setShowUK] = useState(false);
  const [showMexico, setShowMexico] = useState(false);

  const [loading, setLoading] = useState(true);

  {/* Initial data load on component mount */}
  useEffect(() => {
    setLoading(true);
    load().then(setData).then(() => setLoading(false));
  }, []);

  {/* Once data is initialized, update data whenever indicator or range is set */}
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setRealMatrix(sourceData({ indicator, range, data }));
      setNormalizedMatrix(normalizeMatrix(sourceData({ indicator, range, data })));
    }
  }, [indicator, range, data]);

  {/* Debugging: log data updates */}
  useEffect(() => {
    console.log("Data updated: ", realMatrix);
  }, [realMatrix]);

  return (
    <div>
      <header style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
              <h1> Canadian International Trade Dashboard </h1>
              <img src={loonie} alt="Loonie" style={{ width: "100px", height: "100px", marginLeft: "1rem" }} />
      </header>
      
      <nav style={{marginLeft: "2rem"}}>
        <button onClick={() => setCurrentTab("home")}>Home</button>
        <button onClick={() => setCurrentTab("about")}>About</button>
      </nav>

      <div style={{ padding: "1rem" }}>
        {currentTab === "home" && (
          <div>
            <label style={{ marginLeft: "2rem" }}>
              Select range:{" "}
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="1y">Past Year</option>
                <option value="2y">Past 2 Years</option>
                <option value="5y">Past 5 Years</option>
                <option value="10y">Past 10 Years</option>
                <option value="all">All Available Data</option>
              </select>
            </label>

            <label style={{ marginLeft: "2rem" }}>
              Select indicator:{" "}
              <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>
                <option value="aggregate">Aggregate</option>
                <option value="exports">Exports</option>
                <option value="imports">Imports</option>
              </select>
            </label>

            <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
              {/* Toggle boxes for countries */}
              <label>
                <input type="checkbox" checked={showChina} onChange={() => setShowChina(!showChina)} />
                Show China Data
              </label>
              <label>
                <input type="checkbox" checked={showUS} onChange={() => setShowUS(!showUS)} />
                Show US Data
              </label>
              <label>
                <input type="checkbox" checked={showEU} onChange={() => setShowEU(!showEU)} />
                Show EU Data
              </label>
              <label>
                <input type="checkbox" checked={showUK} onChange={() => setShowUK(!showUK)} />
                Show UK Data
              </label>
              <label>
                <input type="checkbox" checked={showMexico} onChange={() => setShowMexico(!showMexico)} />
                Show Mexico Data
              </label>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginLeft: "2rem" }}>
              <div className="chart-container">
                <h2> Normalized Trade Data </h2>
                <p> Displayed in percentage of value at earliest selected date </p>
                <div className="chart-wrapper">
                  <Chart data={normalizedMatrix} showChina={showChina} showUS={showUS} showEU={showEU} showUK={showUK} showMexico={showMexico}/>
                  {/*loading && (
                    <div className="loading-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div className="spinner" style={{ marginRight: "1rem" }}></div>
                      Loading customs data...
                    </div>
                  )*/}
                </div>
              </div>
              <div className="chart-container">
                <h2> Real Trade Data </h2>
                <p> Displayed in millions of Canadian dollars (CAD) </p>
                <div className="chart-wrapper">
                  <Chart data={realMatrix} showChina={showChina} showUS={showUS} showEU={showEU} showUK={showUK} showMexico={showMexico} />
                </div>
              </div>
            </div>
            <p style={{ marginLeft: "2rem", fontSize: "12px" }}> Statistics Canada. Table 12-10-0011-01  International merchandise trade for all countries and by Principal Trading Partners, monthly (x 1,000,000). </p>
          </div>
        )}

        {currentTab === "about" && (
          <div style={{ padding: "2rem" }}>
            <h2> Motivation </h2>
            <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
            {motivation}
            </div>
            <h2> Source Information </h2>
            <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
              {sourceinfo}
              <b/>
              <a style={{ marginLeft: "0.25rem" }} href="https://www23.statcan.gc.ca/imdb/p2SV.pl?Function=getSurvey&SDDS=2201" target="_blank" rel="noopener noreferrer">
              Learn more </a>
              <p style={{marginLeft: "2rem"}}> Created by George Branda for educational and recreational purposes. </p>
            </div>
            {/*<img src={beaver} alt="National animal" style={{ width: "100px", height: "100px", marginLeft: "1rem", marginRight: "1rem" }} /> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App