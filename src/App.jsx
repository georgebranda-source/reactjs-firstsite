import { useState } from "react";
import CustomsTracker from './pages/CustomsTracker.jsx';
import About from './pages/About.jsx';
import loonie from './assets/loonie.png';

function App() {
  const [currentTab, setCurrentTab] = useState("customs tracker");

  return (
    <div>
      <header style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
              <h1> Canadian International Trade Dashboard </h1>
              <img src={loonie} alt="Loonie" style={{ width: "100px", height: "100px", marginLeft: "1rem" }} />
      </header>
      
      <nav style={{marginLeft: "2rem"}}>
        <button onClick={() => setCurrentTab("customs tracker")}>Customs Tracker</button>
        <button onClick={() => setCurrentTab("about")}>About</button>
      </nav>

      <div style={{ padding: "1rem" }}>
        {currentTab === "customs tracker" && <CustomsTracker />}
        {currentTab === "about" && (<About />)}
      </div>
    </div>
  );
}

export default App