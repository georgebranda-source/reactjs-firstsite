import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function CustomsChart({ data, loading, apiError, showChina, showUS, showEU, showUK, showMexico, imports, exports, aggregate }) {
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
                            {showChina&&<Line dataKey="chinaImports" stroke="red" name="China Imports" dot={false} strokeWidth={3} strokeDasharray="1 1 1 1"/>}
                            {showUS&&<Line dataKey="usImports" stroke="blue" name="US Imports" dot={false} strokeWidth={3} strokeDasharray="1 1 1 1"/>}
                            {showEU&&<Line dataKey="euImports" stroke="yellow" name="EU Imports" dot={false} strokeWidth={3} strokeDasharray="1 1 1 1"/>}
                            {showUK&&<Line dataKey="ukImports" stroke="purple" name="UK Imports" dot={false} strokeWidth={3} strokeDasharray="1 1 1 1"/>}
                            {showMexico&&<Line dataKey="ukImports" stroke="green" name="Mexico Imports" dot={false} strokeWidth={3} strokeDasharray="1 1 1 1"/>}
                        </>
                    )}
                    {exports && (
                        <>
                            {showChina&&<Line dataKey="chinaExports" stroke="red" name="China Exports" dot={false} strokeWidth={3} strokeDasharray="3 4 5 2"/>}
                            {showUS&&<Line dataKey="usExports" stroke="blue" name="US Exports" dot={false} strokeWidth={3} strokeDasharray="3 4 5 2"/>}
                            {showEU&&<Line dataKey="euExports" stroke="yellow" name="EU Exports" dot={false} strokeWidth={3} strokeDasharray="3 4 5 2"/>}
                            {showUK&&<Line dataKey="ukExports" stroke="purple" name="UK Exports" dot={false} strokeWidth={3} strokeDasharray="3 4 5 2"/>}
                            {showMexico&&<Line dataKey="mexicoExports" stroke="green" name="Mexico Exports" dot={false} strokeWidth={3} strokeDasharray="3 4 5 2"/>}
                        </>
                    )}
                    {aggregate && (
                        <>
                            {showChina&&<Line dataKey="chinaAggregate" stroke="red" name="China Aggregate" dot={false} strokeWidth={3}/>}
                            {showUS&&<Line dataKey="usAggregate" stroke="blue" name="US Aggregate" dot={false} strokeWidth={3}/>}
                            {showEU&&<Line dataKey="euAggregate" stroke="yellow" name="EU Aggregate" dot={false} strokeWidth={3}/>}
                            {showUK&&<Line dataKey="ukAggregate" stroke="purple" name="UK Aggregate" dot={false} strokeWidth={3}/>}
                            {showMexico&&<Line dataKey="mexicoAggregate" stroke="green" name="Mexico Aggregate" dot={false} strokeWidth={3}/>}
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