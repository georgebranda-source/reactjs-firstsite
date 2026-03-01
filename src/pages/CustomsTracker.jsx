import { useEffect, useState } from "react";
import { loadCustoms, filterCustomsData, normalizeCustomsData, formatValues } from '../utils/customs-utils.js';
import CustomsChart from '../components/CustomsChart.jsx';
import DateSlider from '../components/DateSlider.jsx'
import SmallSideCard from '../components/SmallSideCard.jsx'
import customssourceinfo from '../assets/customssourceinfo.txt?raw'
import { RangeSlider, Container, Flex, Box, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export default function CustomsTracker() {
    const [data, setData] = useState([]);
    const [realMatrix, setRealMatrix] = useState([]);
    const [normalizedMatrix, setNormalizedMatrix] = useState([]);

    const [range, setRange] = useState([2022, 2026]);
    const [indicator, setIndicator] = useState("aggregate");
    const [exports, setExports] = useState(false);
    const [imports, setImports] = useState(false);
    const [aggregate, setAggregate] = useState(false);
    const [showChina, setShowChina] = useState(true);
    const [showUS, setShowUS] = useState(true);
    const [showEU, setShowEU] = useState(true);
    const [showUK, setShowUK] = useState(false);
    const [showMexico, setShowMexico] = useState(false);

    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    
    useEffect(() => {
        //Initial data load on component mount
        setLoading(true);
        loadCustoms()
            .then(setData)
            .catch(error => {
                console.error("Unable to fetch data", error);
                setApiError(true);
            })
            .then(console.log('Initial data: ', data))
    }, []);
    
    useEffect(() => {
        //Set graph matrices when data is initialized/indicator or range change
        if (data.length > 0) {
            if (indicator==="aggregate") {
                setAggregate(true),
                setImports(false),
                setExports(false)
            }
            else if (indicator==="imports") {
                setAggregate(false),
                setImports(true),
                setExports(false)
            }
            else if (indicator==="exports") {
                setAggregate(false),
                setImports(false),
                setExports(true)
            }
            const filtered = filterCustomsData({range, data});
            setRealMatrix(formatValues(filtered));
            setNormalizedMatrix(formatValues(normalizeCustomsData(filtered)));
            setLoading(false);
        }
    }, [data, indicator, range]);
    
    useEffect(() => {
        //Debugging: log data updates
        console.log("Real matrix updated: ", realMatrix);
    }, [realMatrix]);

    useEffect(() => {
        //Debugging: log data updates
        console.log("Normalized matrix updated: ", normalizedMatrix);
    }, [normalizedMatrix]);
    
    return (
        <div>
            <Container size="xl" px="md">
                {/*Main page layout*/}
                <Flex
                    direction="column"
                    gap="md"
                >
                    {/*Top Section*/}
                    <Flex
                        direction={{base: "column", md: "row"}}
                        w="100%"
                        gap="md"
                    >
                        {/*Title card*/}
                        <Container
                            w="100%"
                            flex={1}
                            h="105px"
                            style={{
                                border: "1px solid var(--mantine-color-gray-4)",
                                borderRadius: "8px",
                                padding: "1.5rem"
                            }}
                        >
                            <Flex
                                direction="column"
                                justify="flex-end"
                                gap="md"
                                w="100%"
                            >
                                <h2 style={{ margin: 0, lineHeight: 1 }}> Customs Data </h2>
                                <p style={{ margin: 0, lineHeight: 1 }}>  </p>
                            </Flex>
                        </Container>
                            {/*Card area*/}
                            <Flex
                                direction="row"
                                height="105px"
                                justify="flex-end"
                                gap="md"
                            >
                                {/*Card 1*/}
                                {!loading&&<SmallSideCard disabled = {false} title="Trade with China" subtitle="Since last month" previous={data[data.length-2].chinaAggregate} current={data[data.length-1].chinaAggregate}/>}
                                {loading&&<SmallSideCard disabled = {true} size="small"/>}
                                {/*Card 2*/}
                                {!loading&&<SmallSideCard disabled = {false} title="Trade with EU" subtitle="Since last month" previous={data[data.length-2].euAggregate} current={data[data.length-1].euAggregate}/>}
                                {loading&&<SmallSideCard disabled = {true} size="small"/>}
                                {/*Card 2*/}
                                {!loading&&<SmallSideCard disabled = {false} title="Trade with US" subtitle="Since last month" previous={data[data.length-2].usAggregate} current={data[data.length-1].usAggregate}/>}
                                {loading&&<SmallSideCard disabled = {true} size="small"/>}
                            </Flex>
                    </Flex>
                    {/*Controls box*/}
                    <Box
                        w="100%"
                        style={{
                            border: "1px solid var(--mantine-color-gray-4)",
                            borderRadius: "8px",
                            padding: "2rem",
                        }}
                    >
                        <Flex
                            direction="column"
                            gap="xl"
                        >
                            <Flex
                                direction="row"
                                align="center"
                                justify="center"
                                gap="xl"
                            >
                                <Flex
                                        align="center"
                                        justify="center"
                                >
                                    {/*Indicator selector*/}
                                    <label>
                                        Select indicator:{" "}
                                        <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>
                                            <option value="aggregate">Aggregate</option>
                                            <option value="imports">Imports</option>
                                            <option value="exports">Exports</option>
                                        </select>
                                    </label>
                                </Flex>
                            </Flex>
                            {/*Date range slider*/}
                            <div>
                                {loading &&
                                    <RangeSlider disabled/>
                                }
                                {!loading &&
                                    <DateSlider data = {data} value = {range} onChange={setRange}/>
                                }
                            </div>
                            <Flex
                                direction="row"
                                align="center"
                                justify="center"
                                gap="xl"
                            >
                                {/* Toggle boxes for countries */}
                                <div>
                                    <label>
                                        <input type="checkbox" checked={showChina} onChange={() => setShowChina(!showChina)} />
                                        Show China Data
                                    </label>
                                    <label>
                                        <input type="checkbox" checked={showUS} onChange={() => setShowUS(!showUS)} />
                                        Show US Data
                                    </label>
                                    <label>
                                        <input type="checkbox" checked={showEU} onChange={() => setShowEU(!showEU)} />
                                        Show EU Data
                                    </label>
                                    <label>
                                        <input type="checkbox" checked={showUK} onChange={() => setShowUK(!showUK)} />
                                        Show UK Data
                                    </label>
                                    <label>
                                        <input type="checkbox" checked={showMexico} onChange={() => setShowMexico(!showMexico)} />
                                        Show Mexico Data
                                    </label>
                                </div>
                            </Flex>
                        </Flex>
                    </Box>
                    {/*L/R Columns*/}
                    <Flex
                        direction={{base: "column", md: "row"}}
                        gap="md"
                    >
                        {/*L column*/}
                        <Flex
                            direction="column"
                            w={{base: "100%", md: "50%"}}
                            gap="md"
                        >
                            {/*L chart title*/}
                            <Container
                                w="100%"
                                style={{
                                    border: "1px solid var(--mantine-color-gray-4)",
                                    borderRadius: "8px",
                                    padding: "1.5rem"
                                }}
                            >
                                <Flex
                                    direction="column"
                                    justify="flex-end"
                                    gap="md"
                                    w="100%"
                                >
                                    <h2 style={{ margin: 0, lineHeight: 1 }}> Normalized Trade Data </h2>
                                    <p style={{ margin: 0, lineHeight: 1 }}> Displayed in percentage of value at earliest selected date </p>
                                </Flex>
                            </Container>
                            {/*Normalized chart*/}
                            <Container
                                w="100%"
                                style={{
                                    border: "1px solid var(--mantine-color-gray-4)",
                                    borderRadius: "8px",
                                    aspectRatio: '16/9',
                                }}
                            >
                                <CustomsChart data={normalizedMatrix} loading={loading} apiError={apiError} imports={imports} exports={exports} aggregate={aggregate} showChina={showChina} showUS={showUS} showEU={showEU} showUK={showUK} showMexico={showMexico} />                                
                            </Container>
                        </Flex>
                        {/*R column*/}
                        <Flex
                            direction="column"
                            w={{base: "100%", md: "50%"}}
                            gap="md"
                        >
                            {/*R chart title*/}
                            <Container
                                w="100%"
                                style={{
                                    border: "1px solid var(--mantine-color-gray-4)",
                                    borderRadius: "8px",
                                    padding: "1.5rem"
                                }}
                            >
                                <Flex
                                    direction="column"
                                    justify="flex-end"
                                    gap="md"
                                    w="100%"
                                >
                                    <h2 style={{ margin: 0, lineHeight: 1 }}> Real Trade Data </h2>
                                    <p style={{ margin: 0, lineHeight: 1 }}> Displayed in millions of Canadian dollars (CAD) </p>
                                </Flex>
                            </Container>
                            {/*Real chart*/}
                            <Container
                                w="100%"
                                style={{
                                    border: "1px solid var(--mantine-color-gray-4)",
                                    borderRadius: "8px",
                                    aspectRatio: '16/9',
                                }}
                            >
                                <CustomsChart data={realMatrix} loading={loading} apiError={apiError} imports={imports} exports={exports} aggregate={aggregate} showChina={showChina} showUS={showUS} showEU={showEU} showUK={showUK} showMexico={showMexico} />
                            </Container>
                        </Flex>
                    </Flex>
                    {/*Information*/}
                    <Flex direction='column' gap='xs'>
                        <p style={{ marginLeft: "2rem", fontSize: "12px" }}> Statistics Canada. Table 12-10-0011-01  International merchandise trade for all countries and by Principal Trading Partners, monthly (x 1,000,000). </p>
                        <h2> Source Information </h2>
                        <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
                            {customssourceinfo}
                            <b/>
                            <a style={{ marginLeft: "0.25rem" }} href="https://www23.statcan.gc.ca/imdb/p2SV.pl?Function=getSurvey&SDDS=2201" target="_blank" rel="noopener noreferrer">
                            Learn more </a>
                        </div>
                    </Flex>
                </Flex>
            </Container>
        </div>
    )
}




         