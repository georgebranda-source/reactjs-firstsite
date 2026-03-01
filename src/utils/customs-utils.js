import { filterByRange } from './core.js'

export async function loadCustoms() {
    let data = {
        chinaImports: await fetchVector("China", "imports"),
        chinaExports: await fetchVector("China", "exports"),
        usImports: await fetchVector("US", "imports"),
        usExports: await fetchVector("US", "exports"),
        euImports: await fetchVector("EU", "imports"),
        euExports: await fetchVector("EU", "exports"),
        ukImports: await fetchVector("UK", "imports"),
        ukExports: await fetchVector("UK", "exports"),
        mexicoImports: await fetchVector("Mexico", "imports"),
        mexicoExports: await fetchVector("Mexico", "exports"),
    }
    data=formatCustomsData(data);
    return data;
}

async function fetchVector(country, impex) {
    //Read country+indicator & decide vector to fetch
    let vectorId;
    const startDate = "1997-01-01";
    const today = new Date().toISOString().split("T")[0];
    if (country === "China") {
        if (impex === "exports") vectorId = "87008907";
        else if (impex === "imports") vectorId = "87008791";
    } else if (country === "US") {
        if (impex === "exports") vectorId = "87008898";
        else if (impex === "imports") vectorId = "87008782";
    } else if (country === "EU") {
        if (impex === "exports") vectorId = "87008899";
        else if (impex === "imports") vectorId = "87008783";
    } else if (country === "UK") {
        if (impex === "exports") vectorId = "87008900";
        else if (impex === "imports") vectorId = "87008784";
    } else if (country === "Mexico") {
        if (impex === "exports") vectorId = "87008908";
        else if (impex === "imports") vectorId = "87008792";
    }

    //Fetch data from API & return as array
    const response = await fetch(`https://www150.statcan.gc.ca/t1/wds/rest/getDataFromVectorByReferencePeriodRange?vectorIds="${vectorId}"&startRefPeriod=${startDate}&endReferencePeriod=${today}`)
    const json = await response.json();
    return json[0].object.vectorDataPoint;
}

function formatCustomsData(data) {
    //Returns an array containing objects with date, import, and export
    data=data.chinaImports.map((item, index) => {
        //Each item in chinaImports (and all of the other sub-arrays in initial data) has 2 attributes: refPer and value.
        return {
            chinaImports: item.value,
            chinaExports: data.chinaExports[index].value,
            chinaAggregate: item.value+data.chinaExports[index].value,
            usImports: data.usImports[index].value,
            usExports: data.usExports[index].value,
            usAggregate: data.usImports[index].value+data.usExports[index].value,
            euImports: data.euImports[index].value,
            euExports: data.euExports[index].value,
            euAggregate: data.euImports[index].value+data.euExports[index].value,
            ukImports: data.ukImports[index].value,
            ukExports: data.ukExports[index].value,
            ukAggregate: data.ukImports[index].value+data.ukExports[index].value,
            mexicoImports: data.mexicoImports[index].value,
            mexicoExports: data.mexicoExports[index].value,
            mexicoAggregate: data.mexicoImports[index].value+data.mexicoExports[index].value,
            timestamp: new Date(item.refPer).getTime(),
            date: new Date(item.refPer).toLocaleDateString("en-US", { year: "numeric", month: "short" }),
        }
    });
    return data;
}

export function filterCustomsData( {data, range}) {
    // Returns the real data matrix for the graphs to use according to selections
    return filterByRange(data, range);
}

export function normalizeCustomsData(matrix) {
    const chinaImportsBase = matrix[0].chinaImports;
    const chinaExportsBase = matrix[0].chinaExports;
    const chinaAggregateBase = matrix[0].chinaAggregate;
    const usImportsBase = matrix[0].usImports;
    const usExportsBase = matrix[0].usExports;
    const usAggregateBase = matrix[0].usAggregate;
    const euImportsBase = matrix[0].euImports;
    const euExportsBase = matrix[0].euExports;
    const euAggregateBase = matrix[0].euAggregate;
    const ukImportsBase = matrix[0].ukImports;
    const ukExportsBase = matrix[0].ukExports;
    const ukAggregateBase = matrix[0].ukAggregate;
    const mexicoImportsBase = matrix[0].mexicoImports;
    const mexicoExportsBase = matrix[0].mexicoExports;
    const mexicoAggregateBase = matrix[0].mexicoAggregate;

    return matrix.map(item => ({
        chinaImports: (item.chinaImports / chinaImportsBase) * 100,
        chinaExports: (item.chinaExports / chinaExportsBase) * 100,
        chinaAggregate: (item.chinaAggregate / chinaAggregateBase) * 100,
        usImports: (item.usImports / usImportsBase) * 100,
        usExports: (item.usExports / usExportsBase) * 100,
        usAggregate: (item.usAggregate / usAggregateBase) * 100,
        euImports: (item.euImports / euImportsBase) * 100,
        euExports: (item.euExports / euExportsBase) * 100,
        euAggregate: (item.euAggregate / euAggregateBase) * 100,
        ukImports: (item.ukImports / ukImportsBase) * 100,
        ukExports: (item.ukExports / ukExportsBase) * 100,
        ukAggregate: (item.ukAggregate / ukAggregateBase) * 100,
        mexicoImports: (item.mexicoImports / mexicoImportsBase) * 100,
        mexicoExports: (item.mexicoExports / mexicoExportsBase) * 100,
        mexicoAggregate: (item.mexicoAggregate / mexicoAggregateBase) * 100,
        timestamp: item.timestamp,
        date: item.date,
    }));
}

export function formatValues(matrix) {
    {/*Returns matrix with values as strings with 2 decimals*/}
    return matrix.map(item => ({
        chinaImports: item.chinaImports.toFixed(2),
        chinaExports: item.chinaExports.toFixed(2),
        chinaAggregate: item.chinaAggregate.toFixed(2),
        usImports: item.usImports.toFixed(2),
        usExports: item.usExports.toFixed(2),
        usAggregate: item.usAggregate.toFixed(2),
        euImports: item.euImports.toFixed(2),
        euExports: item.euExports.toFixed(2),
        euAggregate: item.euAggregate.toFixed(2),
        ukImports: item.ukImports.toFixed(2),
        ukExports: item.ukExports.toFixed(2),
        ukAggregate: item.ukAggregate.toFixed(2),
        mexicoImports: item.mexicoImports.toFixed(2),
        mexicoExports: item.mexicoExports.toFixed(2),
        mexicoAggregate: item.mexicoAggregate.toFixed(2),
        timestamp: item.timestamp,
        date: item.date,
    }));
}