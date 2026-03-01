import { filterByRange } from './core.js'

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
    return data;
}

function formatPortData(data) {
    //Returns an ordered array containing objects with date, import, and export
    data=data.map(item => {
        return {
            imports_tanker:item.attributes.import_tanker,
            imports_cargo:item.attributes.import_cargo,
            imports:item.attributes.import,
            exports_tanker:item.attributes.export_tanker,
            exports_cargo:item.attributes.export_cargo,
            exports:item.attributes.export,
            aggregate_tanker: item.attributes.export_tanker+item.attributes.import_tanker,
            aggregate_cargo:item.attributes.export_cargo+item.attributes.import_cargo,
            aggregate:item.attributes.export+item.attributes.import,
            timestamp: new Date(item.attributes.year, item.attributes.month-1, item.attributes.day).getTime(),
            date: new Date(item.attributes.year, item.attributes.month-1, item.attributes.day).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        }
    });
    data.sort((a, b) => a.timestamp-b.timestamp);
    return data;
}

export function filterRangeResolution(data, resolution, range) {
    let matrix=filterByRange(data, range);
    console.log("Data post filterbyrange: ", matrix);
    //Filter matrix based on chosen timeline window

    //Once dates are chosen, filters matrix to only include points at desired resolution  
    if (resolution==='monthly') {
        matrix=totalByMonth(matrix);
    } else if (resolution==='weekly') {
        matrix=totalByWeek(matrix);
    }
    return matrix;
}

function totalByWeek(matrix) {
    let totaled=[];
    let monday=0;
    //Will not total most recent dates that are not a full week
    while (monday+7<=matrix.length) {
        let index=monday;
        let weeklyTotal= {
            imports_tanker:0,
            imports_cargo:0,
            imports:0,
            exports_tanker: 0,
            exports_cargo: 0,
            exports: 0,
            aggregate_tanker: 0,
            aggregate_cargo: 0,
            aggregate: 0,
            timestamp: matrix[monday].timestamp,
            date: matrix[monday].date
        }
        while (index<monday+7 && index<matrix.length) {
            //For each day of the week, add it to the total
            weeklyTotal.imports_tanker+=matrix[index].imports_tanker;
            weeklyTotal.imports_cargo+=matrix[index].imports_cargo;
            weeklyTotal.imports+=matrix[index].imports;
            weeklyTotal.exports_tanker+=matrix[index].exports_tanker;
            weeklyTotal.exports_cargo+=matrix[index].exports_cargo;
            weeklyTotal.exports+=matrix[index].exports;
            weeklyTotal.aggregate_tanker+=matrix[index].aggregate_tanker;
            weeklyTotal.aggregate_cargo+=matrix[index].aggregate_cargo;
            weeklyTotal.aggregate+=matrix[index].aggregate;
            index++;
        }
        totaled.push(weeklyTotal);
        monday+=7;
    }
    return totaled;
}

export function totalByMonth(matrix) {
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
                imports_tanker:0,
                imports_cargo:0,
                imports:0,
                exports_tanker: 0,
                exports_cargo: 0,
                exports: 0,
                aggregate_tanker: 0,
                aggregate_cargo: 0,
                aggregate: 0,
                timestamp: element.timestamp,
                date: element.date
            };
            tally=0;
        }
        monthMap[monthKey].imports_tanker+=element.imports_tanker;
        monthMap[monthKey].imports_cargo+=element.imports_cargo;
        monthMap[monthKey].imports+=element.imports;
        monthMap[monthKey].exports_tanker+=element.exports_tanker;
        monthMap[monthKey].exports_cargo+=element.exports_cargo;
        monthMap[monthKey].exports+=element.exports;
        monthMap[monthKey].aggregate_tanker+=element.aggregate_tanker;
        monthMap[monthKey].aggregate_cargo+=element.aggregate_cargo;
        monthMap[monthKey].aggregate+=element.aggregate;
        tally++;
    });
    //If there was data for fewer than 28 days this month, that is not counted as a month and the values are not displayed.
    if (tally <28) {
        delete monthMap[monthKey];
    }

    return Object.values(monthMap);
}

export function selectShipType(matrix, type) {
    //Takes fil data set and decides what to display based on user selections

    //First filters data to include only desired ship type
    if (type==='cargo') {
        matrix=data.map(item => {
            return {
                importvalue:item.imports_cargo,
                exportvalue:item.exports_cargo,
                aggregatevalue:item.aggregate_cargo,
                timestamp:item.timestamp,
                date:item.date
            }
        });
    } else if (type==='tanker') {
        matrix=data.map(item => {
            return {
                importvalue:item.imports_tanker,
                exportvalue:item.exports_tanker,
                aggregatevalue:item.aggregate_tanker,
                timestamp:item.timestamp,
                date:item.date
            }
        });
    } else if (type==='all') {
        matrix=data.map(item => {
            return {
                importvalue:item.imports,
                exportvalue:item.exports,
                aggregatevalue:item.aggregate,
                timestamp:item.timestamp,
                date:item.date
            }
        });
    }

    return matrix;
}