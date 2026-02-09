export async function load() {
      const chinaImports =  await fetchVector("China", "imports", "all");
      const chinaExports =  await fetchVector("China", "exports", "all");
      const usImports =  await fetchVector("US", "imports", "all");
      const usExports =  await fetchVector("US", "exports", "all");
      const euImports =  await fetchVector("EU", "imports", "all");
      const euExports =  await fetchVector("EU", "exports", "all");
      const ukImports =  await fetchVector("UK", "imports", "all");
      const ukExports =  await fetchVector("UK", "exports", "all");
      const mexicoImports =  await fetchVector("Mexico", "imports", "all");
      const mexicoExports =  await fetchVector("Mexico", "exports", "all");
      return {
        chinaImports,
        chinaExports,
        usImports,
        usExports,
        euImports,
        euExports,
        ukImports,
        ukExports,
        mexicoImports,
        mexicoExports
    };
}

export function sourceData( {indicator, range, data}) {
    {/* Returns the real data matrix for the graphs to use according to selections*/}
    let matrix;

    {/*Read indicator & build array*/}
    if (indicator === "exports") {
        matrix = mergeArrays(data.chinaExports, data.usExports, data.euExports, data.ukExports, data.mexicoExports);
    } else if (indicator === "imports") {
        matrix = mergeArrays(data.chinaImports, data.usImports, data.euImports, data.ukImports, data.mexicoImports);
    } else if (indicator === "aggregate") {
        let chinaAggregate = data.chinaExports.map((exp, index) => ({refPer: exp.refPer, value: exp.value + data.chinaImports[index].value}));
        let usAggregate = data.usExports.map((exp, index) => ({refPer: exp.refPer, value: exp.value + data.usImports[index].value}));
        let euAggregate = data.euExports.map((exp, index) => ({refPer: exp.refPer, value: exp.value + data.euImports[index].value}));
        let ukAggregate = data.ukExports.map((exp, index) => ({refPer: exp.refPer, value: exp.value + data.ukImports[index].value}));
        let mexicoAggregate = data.mexicoExports.map((exp, index) => ({refPer: exp.refPer, value: exp.value + data.mexicoImports[index].value}));
        matrix = mergeArrays(chinaAggregate, usAggregate, euAggregate, ukAggregate, mexicoAggregate);
    }

    {/*Read range & calculate earliest date*/}
    let cutoff;
    if (range === "1y") {
        const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
        cutoff = new Date(oneYearAgo).toISOString().split("T")[0];
    } else if (range === "2y") {
        const twoYearsAgo = new Date().setFullYear(new Date().getFullYear() - 2);
        cutoff = new Date(twoYearsAgo).toISOString().split("T")[0];
    } else if (range === "5y") {
        const fiveYearsAgo = new Date().setFullYear(new Date().getFullYear() - 5);
        cutoff = new Date(fiveYearsAgo).toISOString().split("T")[0];
    } else if (range === "10y") {
        const tenYearsAgo = new Date().setFullYear(new Date().getFullYear() - 10);
        cutoff = new Date(tenYearsAgo).toISOString().split("T")[0];
    } else if (range === "all") {
        cutoff = "1997-01-01";
    }

    {/*Filter array according to cutoff date*/}
    matrix = matrix.filter(item => item.refPer >= cutoff);
    return matrix;
}

function mergeArrays(chinaArray, usArray, euArray, ukArray, mexicoArray) {
    return chinaArray.map((item1, index) => ({
        refPer: item1.refPer,
        chinaValue: item1.value,
        usValue: usArray[index].value,
        euValue: euArray[index].value,
        ukValue: ukArray[index].value,
        mexicoValue: mexicoArray[index].value
    }));
}

export function formatValues(matrix) {
    {/*Returns matrix with values as strings with 2 decimals*/}
    return matrix.map(item => ({
        refPer: item.refPer,
        chinaValue: item.chinaValue.toFixed(2),
        usValue: item.usValue.toFixed(2),
        euValue: item.euValue.toFixed(2),
        ukValue: item.ukValue.toFixed(2),
        mexicoValue: item.mexicoValue.toFixed(2)
    }));
}

export function formatDates(matrix) {
    {/*Formats date from YYYY-MM-DD to Month, X, XXXX*/}
    return matrix.map(item => ({
        ...item,
        refPer: new Date(item.refPer).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }));
}

export function normalizeMatrix(matrix) {
    const chinaBase = matrix[0].chinaValue;
    const usBase = matrix[0].usValue;
    const euBase = matrix[0].euValue;
    const ukBase = matrix[0].ukValue;
    const mexicoBase = matrix[0].mexicoValue;
    return matrix.map(item => ({
        refPer: item.refPer,
        chinaValue: (item.chinaValue / chinaBase) * 100,
        usValue: (item.usValue / usBase) * 100,
        euValue: (item.euValue / euBase) * 100,
        ukValue: (item.ukValue / ukBase) * 100,
        mexicoValue: (item.mexicoValue / mexicoBase) * 100
    }));
}

async function fetchVector(country, impex) {
    const data = [];
    const startDate = "1997-01-01";
    const today = new Date().toISOString().split("T")[0];

    {/*Read country+indicator & decide vector*/}
    let vectorId;
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

    {/*Fetch data from API & return as array*/}
    const response = await fetch(`https://www150.statcan.gc.ca/t1/wds/rest/getDataFromVectorByReferencePeriodRange?vectorIds="${vectorId}"&startRefPeriod=${startDate}&endReferencePeriod=${today}`)
    const json = await response.json();
    
    return json[0].object.vectorDataPoint;
}