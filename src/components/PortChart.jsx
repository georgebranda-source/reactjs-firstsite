import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function PortChart({ data, loading, apiError, imports, exports, aggregate, cargo, tanker, all }) {
    return (
        <div
            className="chart-wrapper"
            style={{
                width: "100%",
                height: "100%",
                padding: "1.5rem",
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data} 
                    margin={{left: 0, right: 55, bottom: -10, top: 10}}
                    style={{ border: '0px solid #000000', padding: '0px'}}>
                    <XAxis dataKey="date"/>
                    <YAxis />
                    {imports && (
                        <>
                            {cargo&&<Line dataKey="imports_cargo" stroke="blue" name="Cargo Imports" dot={false} strokeWidth={3} />}
                            {tanker&&<Line dataKey="imports_tanker" stroke="blue" name="Tanker Imports" dot={false} strokeWidth={3} />}
                            {all&&<Line dataKey="imports" stroke="blue" name="Total Imports" dot={false} strokeWidth={3} />}
                        </>
                    )}

                    {exports && (
                        <>
                            {cargo&&<Line dataKey="exports_cargo" stroke="red" name="Cargo Exports" dot={false} strokeWidth={3} />}
                            {tanker&&<Line dataKey="exports_tanker" stroke="red" name="Tanker Exports" dot={false} strokeWidth={3} />}
                            {all&&<Line dataKey="exports" stroke="red" name="Total Exports" dot={false} strokeWidth={3} />}
                        </>
                    )}        

                    {aggregate && (
                        <>
                            {cargo&&<Line dataKey="aggregate_cargo" stroke="purple" name="Cargo Aggregate" dot={false} strokeWidth={3} />}
                            {tanker&&<Line dataKey="aggregate_tanker" stroke="purple" name="Tanker Aggregate" dot={false} strokeWidth={3} />}
                            {all&&<Line dataKey="aggregate" stroke="purple" name="Total Aggregate" dot={false} strokeWidth={3} />}
                        </>
                    )}

                    <Tooltip 
                        labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                    />
                    <Legend />
                </LineChart>
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner" style={{ marginRight: "1rem" }}/>
                        Loading port activity data...
                    </div>
                    )}
                    {apiError && (
                    <div className="error-overlay">
                        Unable to fetch data. Please reload page or try again later.
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    )
}

export default PortChart;