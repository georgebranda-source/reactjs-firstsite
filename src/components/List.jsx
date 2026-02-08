function List ({ data }) {
    return (
        <div>
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

export default List;