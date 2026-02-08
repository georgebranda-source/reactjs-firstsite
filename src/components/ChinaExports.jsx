import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts"; 

function ChinaExports({ range }) {
    const [data, setData] = useState([]);

    let startDate;
    if (range === "1y") {
        const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
        startDate = new Date(oneYearAgo).toISOString().split("T")[0];
    } else if (range === "5y") {
        const fiveYearsAgo = new Date().setFullYear(new Date().getFullYear() - 5);
        startDate = new Date(fiveYearsAgo).toISOString().split("T")[0];
    } else if (range === "10y") {
        const tenYearsAgo = new Date().setFullYear(new Date().getFullYear() - 10);
        startDate = new Date(tenYearsAgo).toISOString().split("T")[0];
    } else if (range === "all") {
        startDate = "1997-01-01";
    }
    console.log("Start Date:", startDate);
    const today = new Date().toISOString().split("T")[0];
    console.log("Today's Date:", today);


    useEffect(() => {
        fetch(`https://www150.statcan.gc.ca/t1/wds/rest/getDataFromVectorByReferencePeriodRange?vectorIds="87008907"&startRefPeriod=${startDate}&endReferencePeriod=${today}`)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setData(json[0].object.vectorDataPoint);
        })
        .catch(err => {
            console.error("API fetch error:", err);
            alert("Failed to fetch data.");
        });
    }, [range, startDate, today]);

    return (
        <div>
            <h2>Canadian Exports to China, Monthly</h2>
            {/*Building a simple line chart*/}
            <LineChart width={600} height={300} data={data}>
                <XAxis dataKey="refPer" />
                <YAxis />
                <Line dataKey="value" stroke="#000000" />
            </LineChart>
            {/* listing data points */}
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        Month: {item.refPer}, Export Value: {item.value}
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default ChinaExports;