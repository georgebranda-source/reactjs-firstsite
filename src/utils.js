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

export function filterCustomsData( {indicator, range, data}) {
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
        refPer: new Date(item.refPer).toLocaleDateString("en-US", { year: "numeric", month: "short" })
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

export async function loadPortData() {
    //Returns formatted array of each year of live port data
    //2019-2020
    let response = await fetch("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Daily_Ports_Data/FeatureServer/0/query?where=portid%20%3D%20'PORT1350'%20AND%20year%20%3E%3D%202019%20AND%20year%20%3C%3D%202020&outFields=year,month,day,import_tanker,import_cargo,import,export_tanker,export_cargo,export&returnGeometry=false&outSR=4326&f=json")
    let json = await response.json();
    let data=json.features;
    //2021-2022
    response = await fetch("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Daily_Ports_Data/FeatureServer/0/query?where=portid%20%3D%20'PORT1350'%20AND%20year%20%3E%3D%202021%20AND%20year%20%3C%3D%202022&outFields=year,month,day,import_tanker,import_cargo,import,export_tanker,export_cargo,export&returnGeometry=false&outSR=4326&f=json")
    json = await response.json();
    data.push(... json.features);
    //2023-2024
    response = await fetch("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Daily_Ports_Data/FeatureServer/0/query?where=portid%20%3D%20'PORT1350'%20AND%20year%20%3E%3D%202023%20AND%20year%20%3C%3D%202024&outFields=year,month,day,import_tanker,import_cargo,import,export_tanker,export_cargo,export&returnGeometry=false&outSR=4326&f=json")
    json = await response.json();
    data.push(... json.features);
    //2025-2026
    response = await fetch("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Daily_Ports_Data/FeatureServer/0/query?where=portid%20%3D%20'PORT1350'%20AND%20year%20%3E%3D%202025%20AND%20year%20%3C%3D%202026&outFields=year,month,day,import_tanker,import_cargo,import,export_tanker,export_cargo,export&returnGeometry=false&outSR=4326&f=json")
    json = await response.json();
    data.push(... json.features);
    data = formatPortData(data);
    console.log('Initial load: ', data);
    return data;
}

function formatPortData(data) {
    //Returns an array containing objects with date, import, and export
    data=data.map(item => {
        return {
            imports_tanker:item.attributes.import_tanker,
            imports_cargo:item.attributes.import_cargo,
            imports:item.attributes.import,
            exports_tanker:item.attributes.export_tanker,
            exports_cargo:item.attributes.export_cargo,
            exports:item.attributes.export,
            timestamp: new Date(item.attributes.year, item.attributes.month-1, item.attributes.day).getTime(),
            date: new Date(item.attributes.year, item.attributes.month-1, item.attributes.day).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        }
    });
    data.sort((a, b) => a.timestamp-b.timestamp);
    /*
    REDUNDANT: Remove duplicate dates from array
    console.log('Avant merge:', data);
    //Merge duplicate dates
    let thinned=[]; 
    data.forEach(element => {
        const duplicate = thinned.find(e => e.timestamp === element.timestamp);

        if (!duplicate) {
            thinned.push({ ...element }); 
        }
    });
    data=thinned;
    */
    return data;
}

export function filterPortData(data, resolution, type, range) {
    //Takes full data set and decides what to display based on user selections
    let matrix;

    //First filters data to include only desired ship type
    if (type==='cargo') {
        matrix=data.map(item => {
            return {
                importvalue:item.imports_cargo,
                exportvalue:item.exports_cargo,
                timestamp:item.timestamp,
                date:item.date
            }
        });
    } else if (type==='tanker') {
        matrix=data.map(item => {
            return {
                importvalue:item.imports_tanker,
                exportvalue:item.exports_tanker,
                timestamp:item.timestamp,
                date:item.date
            }
        });
    } else if (type==='all') {
        matrix=data.map(item => {
            return {
                importvalue:item.imports,
                exportvalue:item.exports,
                timestamp:item.timestamp,
                date:item.date
            }
        });
    }

    /*Filter matrix according to cutoff date*/
    let cutoffLow = new Date(range[0], 0, 1).getTime();
    let cutoffHigh = new Date(range[1], 11, 31).getTime();
    matrix = matrix.filter(item => item.timestamp >= cutoffLow);
    matrix = matrix.filter(item => item.timestamp <= cutoffHigh);

    //Filters matrix to only include points at desired resolution  
    if (resolution==='monthly') {
        matrix=aggregateByMonth(matrix);
    } else if (resolution==='weekly') {
        matrix=aggregateByWeek(matrix);
    }

    return matrix;
}

function aggregateByWeek(matrix) {
    let aggregated=[];
    let monday=0;
    //Will not total most recent dates that are not a full week
    while (monday+7<=matrix.length) {
        let index=monday;
        let weeklyAggregate= {
            importvalue: 0,
            exportvalue: 0,
            timestamp: matrix[monday].timestamp,
            date: matrix[monday].date
        }
        while (index<monday+7 && index<matrix.length) {
            //For each day of the week, add it to the total
            weeklyAggregate.importvalue+=matrix[index].importvalue;
            weeklyAggregate.exportvalue+=matrix[index].exportvalue;
            index++;
        }
        aggregated.push(weeklyAggregate);
        monday+=7;
    }
    return aggregated;
}

function aggregateByMonth(matrix) {
    //Create an empty object literal
    const monthMap = {};
    let tally=0;
    let monthKey;

    matrix.forEach(element => {
        const dateObj = new Date(element.timestamp);
        //Builds a string with the year and month, ex. '2026-1'
        monthKey= `${dateObj.getFullYear()}-${dateObj.getMonth()}`;

        //Creates month item if this is the first of the month, then adds the current day's values to it.
        if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
                importvalue: 0,
                exportvalue: 0,
                timestamp: element.timestamp,
                date: element.date
            };
            tally=0;
        }
        monthMap[monthKey].importvalue += element.importvalue;
        monthMap[monthKey].exportvalue += element.exportvalue;
        tally++;
    });
    //If there was data for fewer than 28 days this month, that is not counted as a month and the values are not displayed.
    if (tally <28) {
        delete monthMap[monthKey];
    }

    return Object.values(monthMap);
}