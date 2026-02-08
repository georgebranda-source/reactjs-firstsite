import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"; 

function Chart({ data }) {
    const [showChina, setShowChina] = useState(true);
    const [showUS, setShowUS] = useState(true);
    const [showEU, setShowEU] = useState(true);
    const [showUK, setShowUK] = useState(true);
    const [showMexico, setShowMexico] = useState(true);
    return (
        <div>
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

            {/*Building a simple line chart*/}
            <LineChart width={600} height={300} data={data}>
                <XAxis dataKey="refPer" />
                <YAxis />
                <Tooltip />
                <Legend />
                {showChina && <Line dataKey="chinaValue" stroke="#ff0000" name="China"/>}
                {showUS && <Line dataKey="usValue" stroke="#0000ff" name="US"/>}
                {showEU && <Line dataKey="euValue" stroke="#ffff00" name="EU"/>}
                {showUK && <Line dataKey="ukValue" stroke="#800080" name="UK"/>}
                {showMexico && <Line dataKey="mexicoValue" stroke="#008000" name="Mexico"/>}
            </LineChart>
        </div>
    )
}

export default Chart;