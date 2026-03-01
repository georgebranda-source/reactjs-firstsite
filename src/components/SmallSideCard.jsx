import { Sparkline } from '@mantine/charts';
import { Container, Flex, Text } from '@mantine/core';

export default function SideCard({ disabled, title, subtitle, previous, current }) {
    const percentChange = (((current - previous) / previous) * 100).toFixed(1);
    let positive;
    if (percentChange>=0) {
        positive=true;
    } else if (percentChange<0) {
        positive=false;
    }
    return (
        <Container
            style={{
                border: '1px solid var(--mantine-color-gray-4)',
                borderRadius: '8px',
                aspectRatio: "21/9",
                height: "105px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingTop: "1rem",
                paddingLeft: "1rem",
                paddingRight: "0.5rem",
            }}
        >
            {!disabled && ( <>
                <Text fw={700} size="xs">
                    {title}
                </Text>

                <Flex direction="row" gap="xs" h="100%" align="center">
                    <Line previous={previous} current={current} />
                    
                    {/* Number and subtitle on same line */}
                    <Flex align="baseline" gap="xs">
                        <Text fw={700} fz={32}>
                            {positive&&'+'}{percentChange}%
                        </Text>
                        <Text size="xs" c="dimmed" style={{alignSelf: 'flex-start', marginTop: '10px'}}>
                            {subtitle}
                        </Text>
                    </Flex>
                </Flex>
            </>)}
        </Container>
    );
}

function Line({ previous, current }) {
    current+=5*(current-previous) //Dramatizing slope
    return (
        <Sparkline
            w={50}
            h={50}
            data={[previous, current]}
            curveType="linear"
            trendColors={{ positive: 'teal.6', negative: 'red.6', neutral: 'gray.5' }}
            fillOpacity={0.3}
        />
    );
}
