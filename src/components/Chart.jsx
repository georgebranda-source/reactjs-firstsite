import { formatValues, formatDates } from "../utils.js";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function Chart({ data, showChina, showUS, showEU, showUK, showMexico, loading, apiError }) {
    data = formatValues(data);
    data = formatDates(data);

    return (
        <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={600}
                    height={300}
                    data={data} 
                    margin={{left: 0, right: 55, bottom: -10, top: 10}}
                    style={{ border: '0px solid #000000', padding: '0px'}}>
                        <XAxis dataKey="refPer"/>
                        <YAxis />

                        <Tooltip 
                            labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                        />
                        <Legend />
                        {showChina && <Line dataKey="chinaValue" stroke="#e01414" name="China" dot={false} strokeWidth={3}/>}
                        {showUS && <Line dataKey="usValue" stroke="#0000bc" name="US" dot={false} strokeWidth={3}/>}
                        {showEU && <Line dataKey="euValue" stroke="#dede14" name="EU" dot={false} strokeWidth={3}/>}
                        {showUK && <Line dataKey="ukValue" stroke="#800080" name="UK" dot={false} strokeWidth={3}/>}
                        {showMexico && <Line dataKey="mexicoValue" stroke="#008000" name="Mexico" dot={false} strokeWidth={3}/>}
                </LineChart>
            </ResponsiveContainer>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner" style={{ marginRight: "1rem" }}></div>
                    Loading customs data...
                </div>
                )}
                {apiError && (
                <div className="error-overlay">
                    Unable to fetch data. Please reload page or try again later.
                </div>
            )}
        </div>
    )
}

export default Chart;