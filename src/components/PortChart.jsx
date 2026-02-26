import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function PortChart({ data, loading, apiError, imports, exports }) {
    return (
        <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={600}
                    height={300}
                    data={data} 
                    margin={{left: 0, right: 55, bottom: -10, top: 10}}
                    style={{ border: '0px solid #000000', padding: '0px'}}>
                       <XAxis dataKey="date"/>
                        <YAxis />
                        {imports&&<Line dataKey="importvalue" stroke="#e01414" name="Imports" dot={false} strokeWidth={3} isAnimationActive={false}/>}
                        {exports&&<Line dataKey="exportvalue" stroke="#2214e0" name="Exports" dot={false} strokeWidth={3}/>}

                        <Tooltip 
                            labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                        />
                        <Legend />
                </LineChart>
            </ResponsiveContainer>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner" style={{ marginRight: "1rem" }}></div>
                    Loading port activity data...
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

export default PortChart;