import { RangeSlider } from '@mantine/core';

export default function DateSlider({data, value, onChange}) {
    //Start by finding the earliest and latest years in matrix
    const firstYear= new Date (data[0].timestamp).getFullYear();
    const finalYear= new Date (data[data.length-1].timestamp).getFullYear();

    //Then create the array marks which includes readable objects for those two years and every year in between them.
    let marks=[];
    let current=firstYear;
    while (current <= finalYear) {
        marks.push({ value: current, label: `${current}`});
        current++;
    }
    if (marks.length>10) {
        marks=marks.map(item => {
            return {
                value: item.value,
                label: "'"+item.label.toString().slice(-2),
        }});
    }

    return (
        <RangeSlider
            color="red"
            min={firstYear}
            max={finalYear}
            value={value}
            marks={marks}
            label={null}
            onChange={onChange}
            minRange={0}
        />
    )
}