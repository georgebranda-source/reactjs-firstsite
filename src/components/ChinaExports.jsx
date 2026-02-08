import { useEffect, useState } from "react";

function ChinaExports() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`https://www150.statcan.gc.ca/t1/wds/rest/getDataFromVectorByReferencePeriodRange?vectorIds="87008907"&startRefPeriod=2025-07-01&endReferencePeriod=2026-02-08`)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setData(json[0].object.vectorDataPoint);
        })
        .catch(err => {
            console.error("API fetch error:", err);
            alert("Failed to fetch data.");
        });
    }, []);

    return (
        <div>
            <h1>China Exports Data</h1>
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