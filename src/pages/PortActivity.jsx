import { useEffect, useState } from "react";
import { loadPortData, filterRangeResolution, totalByMonth } from '../utils/port-utils.js';
import PortChart from '../components/PortChart.jsx'
import DateSlider from '../components/DateSlider.jsx'
import LargeSideCard from '../components/LargeSideCard.jsx'
import portsourceinfo from '../assets/portsourceinfo.txt?raw'
import { RangeSlider, Container, Flex, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export default function PortActivity() {
    const [data, setData] = useState([]);
    const [portMatrix, setPortMatrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    const [resolution, setRes] = useState('monthly');
    const [type, setType] = useState('all');
    const [tanker, setTanker] =useState(['false']);
    const [cargo, setCargo] = useState(['false']);
    const [all, setAll] = useState(['true']);
    const [range, setRange] = useState([2022, 2026]);
    const [exports, setExports] = useState(true);
    const [imports, setImports] = useState(true);
    const [aggregate, setAggregate] = useState(false);
    const monthlyData = totalByMonth(data);

    const isDesktop = useMediaQuery('(min-width: 62em');


    useEffect(() => {
        //Initial data load on component mount
        setLoading(true);
        loadPortData()
            .then(setData)
            .catch(error => {
                console.error("Unable to fetch data", error);
                setApiError(true);
            })
    }, []);

    useEffect(() => {
        //Set graph matrix when data is initialized
        if (data.length > 0) {
            let matrix = filterRangeResolution(data, resolution, range);
            setPortMatrix(matrix);
            if (type==="tanker") {
                setTanker(true),
                setCargo(false),
                setAll(false)
            }
            else if (type==="cargo") {
                setTanker(false),
                setCargo(true),
                setAll(false)
            }
            else if (type==="all") {
                setTanker(false),
                setCargo(false),
                setAll(true)
            }
            setLoading(false);
        }
    }, [data, resolution, range, type]);

    useEffect(() => {
        //Debugging: log data updates
        console.log("Port data updated: ", portMatrix);
    }, [portMatrix]);


    return (
        <div>
            <Container size="xl" px="md">
                <Flex
                    direction={{ base: "column", md: "row" }}
                    w="100%"
                    align={{base:"center", md: "start"}}
                    justify="center"
                    gap="xl"
                >
                    {/*Main column*/}
                    <Flex
                        direction="column"
                        w={{base: "100%", md: "83.33%"}}
                        gap="md"
                    >
                        {/*Title card*/}
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
                                <h2 style={{ margin: 0, lineHeight: 1 }}> Port of Vancouver Activity Data </h2>
                                <p style={{ margin: 0, lineHeight: 1 }}> Displayed in metric tons </p>
                            </Flex>
                        </Container>
                        {/*Controls box*/}
                        <Container
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
                                {/*Ship type & resolution selectors*/}
                                <Flex
                                    direction={{base: "column", md: "row"}}
                                    align="center"
                                    justify="center"
                                    gap="xl"
                                >
                                    <label>
                                        Select shipment type:{" "}
                                        <select value={type} onChange={(e) => setType(e.target.value)}>
                                            <option value="tanker">Tanker</option>
                                            <option value="cargo">Cargo</option>
                                            <option value="all">All Shipments</option>
                                        </select>
                                    </label>

                                    <label>
                                        Select resolution:{" "}
                                        <select value={resolution} onChange={(e) => setRes(e.target.value)}>
                                            <option value="monthly">Monthly</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="daily">Daily</option>
                                        </select>
                                    </label>
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
                                    {/*Indicator selector*/}
                                    <div>
                                        <label>
                                            <input type="checkbox" checked={imports} onChange={() => setImports(!imports)} />
                                            Show imports
                                        </label>
                                        <label>
                                            <input type="checkbox" checked={exports} onChange={() => setExports(!exports)} />
                                            Show exports
                                        </label>
                                        <label>
                                            <input type="checkbox" checked={aggregate} onChange={() => setAggregate(!aggregate)} />
                                            Show aggregate
                                        </label>
                                    </div>
                                </Flex>
                            </Flex>
                        </Container>
                        {/*Chart box*/}
                        <Box
                            style={{aspectRatio: isDesktop ? '21/9' : '16/9' }}>
                            <Container
                                w="100%"
                                h="100%"
                                style={{
                                    border: "1px solid var(--mantine-color-gray-4)",
                                    borderRadius: "8px",
                                }}
                            >
                                <PortChart data={portMatrix} loading={loading} apiError={apiError} imports={imports} exports={exports} aggregate={aggregate} tanker={tanker} cargo={cargo} all={all}/>
                            </Container>
                        </Box>
                    </Flex>
                    {/*Sidebar*/}
                    <Flex
                        direction="column"
                        flex={1}
                        gap="md"
                        justify="center"
                    >
                        {/* Sidebar Cards */}
                        {/*Card 1*/}
                        {!loading&&<LargeSideCard
                            disabled = {false}
                            title="Total Imports"
                            subtitle="Since previous month"
                            previous={monthlyData[monthlyData.length-2].imports}
                            current={monthlyData[monthlyData.length-1].imports}/>}
                        {loading&&<LargeSideCard disabled = {true} />}
                        {/*Card 2*/}
                        {!loading&&<LargeSideCard
                            disabled = {false}
                            title="Total Exports"
                            subtitle="Since previous month"
                            previous={monthlyData[monthlyData.length-2].exports}
                            current={monthlyData[monthlyData.length-1].exports}/>}
                        {loading&&<LargeSideCard disabled = {true} />}
                        {/*Card 3*/}
                        {!loading&&<LargeSideCard disabled = {true} title="Tanker Exports" subtitle="Since last month" previous='1' current='2'/>}
                        {loading&&<LargeSideCard disabled = {true} />}
                        {/*Card 4*/}
                        {!loading&&<LargeSideCard disabled = {true} title="Tanker Exports" subtitle="Since last month" previous='1' current='2'/>}
                        {loading&&<LargeSideCard disabled = {true} />}
                    </Flex>

                </Flex>
                {/*Information*/}
                <Flex direction='column' gap='xs'>
                    <p style={{ marginLeft: "2rem", fontSize: "12px" }}> Sources: UN Global Platform; IMF PortWatch (portwatch.imf.org). </p>
                    <h2> Source Information </h2>
                    <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
                        {portsourceinfo}
                        <b/>
                        <a style={{ marginLeft: "0.25rem" }} href="https://portwatch.imf.org/datasets/d51e4539d51a4cc793a91f865de6bf80/about" target="_blank" rel="noopener noreferrer">
                        Learn more </a>
                    </div>
                </Flex>
            </Container>
        </div>
    )
}