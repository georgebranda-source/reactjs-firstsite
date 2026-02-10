import { formatValues, formatDates } from "../utils.js";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"; 

function Chart({ data, showChina, showUS, showEU, showUK, showMexico }) {
    data = formatValues(data);
    data = formatDates(data);

    return (
        <div>
            {/*Building a simple line chart*/}
            <LineChart width={600} height={300} data={data} margin={{left: 0, right: 45, bottom: -15, top: -5}}>
                    <XAxis dataKey="refPer" />
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
        </div>
    )
}

export default Chart;