import { useEffect, useState } from "react";
import { loadPortData, filterPortData } from '../utils.js';
import PortChart from '../components/PortChart.jsx'
import { RangeSlider } from '@mantine/core';
import MantinePortChart from '../components/MantinePortChart.jsx';

export default function PortActivity() {
    const [portData, setPortData] = useState([]);
    const [portMatrix, setPortMatrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    const [resolution, setRes] = useState('monthly');
    const [type, setType] =useState('tanker');
    const [range, setRange] = useState([2022, 2026]);
    const [exports, setExports] = useState([true]);
    const [imports, setImports] = useState([true]);


    useEffect(() => {
        //Initial data load on component mount
        setLoading(true);
        loadPortData()
            .then(setPortData)
            .catch(error => {
                console.error("Unable to fetch data", error);
                setApiError(true);
            });
    }, []);

    useEffect(() => {
        //Set graph matrix when data is initialized
        if (portData.length > 0) {
            const matrix = filterPortData(portData, resolution, type, range);
            setPortMatrix(matrix);
        }
        setLoading(false);
    }, [portData, resolution, type, range]);

    useEffect(() => {
        //Debugging: log data updates
        console.log("Port data updated: ", portMatrix);
    }, [portMatrix]);


    return (
        <div>
            {/*Ship type selector*/}
            <label style={{ marginLeft: "2rem" }}>
                Select shipment type:{" "}
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="tanker">Tanker</option>
                    <option value="cargo">Cargo</option>
                    <option value="all">All Shipments</option>
                </select>
            </label>

            {/*Resolution selector*/}
            <label style={{ marginLeft: "2rem" }}>
                Select resolution:{" "}
                <select value={resolution} onChange={(e) => setRes(e.target.value)}>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                </select>
            </label>

            {/*Date range slider*/}
            <div>
                {!loading &&
                    <RangeSlider
                        color="red"
                        min={2019}
                        max={2026}
                        defaultValue={[2022, 2026]}
                        marks={[
                            {value: 2019, label: '2019'},
                            {value: 2020, label: '2020'},
                            {value: 2021, label: '2021'},
                            {value: 2022, label: '2022'},
                            {value: 2023, label: '2023'},
                            {value: 2024, label: '2024'},
                            {value: 2025, label: '2025'},
                            {value: 2026, label: '2026'},
                        ]}
                        label={null}
                        onChange={setRange}
                        minRange={0}
                    />
                }
                {loading &&
                    <RangeSlider
                        disabled
                    />
                }
            </div>

            {/*Indicator selector*/}
            <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
                <label>
                    <input type="checkbox" checked={imports} onChange={() => setImports(!imports)} />
                    Show imports
                </label>
                <label>
                    <input type="checkbox" checked={exports} onChange={() => setExports(!exports)} />
                    Show exports
                </label>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginLeft: "2rem" }}>
                {/*<div className="chart-container">
                    <h2> Port of Vancouver Activity Data </h2>
                    <p> Displayed in metric tons </p>
                    <MantinePortChart data={portMatrix} loading={loading} apiError={apiError} exports={exports} imports={imports} resolution={resolution}/>
                </div>*/}
                <div className="chart-container">
                    <h2> Port of Vancouver Activity Data </h2>
                    <p> Displayed in metric tons </p>
                    <PortChart data={portMatrix} loading={loading} apiError={apiError} imports={imports} exports={exports}/>
                </div>
            </div>
        </div>
    )
}