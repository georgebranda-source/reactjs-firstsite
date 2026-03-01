import motivation from "../assets/motivation.txt?raw";
import beaver from '../assets/beaver.png';

export default function About() {
    return (
        <div style={{ padding: "2rem" }}>
            <h2> Motivation </h2>
        <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
            {motivation}
        </div>
            {/*<img src={beaver} alt="National animal" style={{ width: "100px", height: "100px", marginLeft: "1rem", marginRight: "1rem" }} /> */}
        </div>
    )
}