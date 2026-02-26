import {LineChart, AreaChart} from '@mantine/charts';
import { ResponsiveContainer } from 'recharts';

export default function MantinePortChart({ data, loading, apiError, exports, imports, resolution }) {
    return (
        <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                        h={300}
                        data={data}
                        dataKey="date"
                        series={[
                            imports && { name: 'importvalue', color: 'red' },
                            exports && { name: 'exportvalue', color: 'blue' }
                        ].filter(Boolean)}
                        dotProps={data.length>1 && { r: 2}}
                        lineProps={{
                            isAnimationActive: true,
                            animationDuration: 500,
                            animationEasing: 'ease-in-out'
                        }}
                        curveType="linear"
                        withLegend={true}
                        legendProps={{verticalAlign: 'bottom', height: 50 }}
                        />
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
    );
}