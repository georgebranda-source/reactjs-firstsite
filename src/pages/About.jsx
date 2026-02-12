import sourceinfo from "../assets/sourceinfo.txt?raw";
import motivation from "../assets/motivation.txt?raw";
import beaver from '../assets/beaver.png';

export default function About() {
    return (
        <div style={{ padding: "2rem" }}>
            <h2> Motivation </h2>
        <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
            {motivation}
        </div>
        <h2> Source Information </h2>
        <div style={{ whiteSpace: "pre-line", padding: "2rem" }}>
            {sourceinfo}
            <b/>
            <a style={{ marginLeft: "0.25rem" }} href="https://www23.statcan.gc.ca/imdb/p2SV.pl?Function=getSurvey&SDDS=2201" target="_blank" rel="noopener noreferrer">
            Learn more </a>
            <p> Created by George Branda for educational purposes. </p>
        </div>
            {/*<img src={beaver} alt="National animal" style={{ width: "100px", height: "100px", marginLeft: "1rem", marginRight: "1rem" }} /> */}
        </div>
    )
}