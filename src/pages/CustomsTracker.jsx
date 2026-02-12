import "../index.css";
import { useEffect, useState } from "react";
import Chart from '../components/Chart.jsx';
import { load, normalizeMatrix, sourceData } from '../utils.js';

export default function CustomsTracker() {
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
    const [apiError, setApiError] = useState(false);
    
    {/* Initial data load on component mount */}
    useEffect(() => {
        setLoading(true);
        load()
            .then(setData)
            .catch(error => {
                console.error("Unable to fetch data", error);
                setApiError(true);
            })
            .finally(() => setLoading(false));
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
                    <Chart data={normalizedMatrix} showChina={showChina} showUS={showUS} showEU={showEU} showUK={showUK} showMexico={showMexico} loading={loading} apiError={apiError} />
                </div>
                <div className="chart-container">
                    <h2> Real Trade Data </h2>
                    <p> Displayed in millions of Canadian dollars (CAD) </p>
                    <Chart data={realMatrix} showChina={showChina} showUS={showUS} showEU={showEU} showUK={showUK} showMexico={showMexico} loading={loading} apiError={apiError} />
                </div>
            </div>
            <p style={{ marginLeft: "2rem", fontSize: "12px" }}> Statistics Canada. Table 12-10-0011-01  International merchandise trade for all countries and by Principal Trading Partners, monthly (x 1,000,000). </p>
        </div>
    )
}