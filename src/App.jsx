// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import { MantineProvider } from '@mantine/core';

import { useState } from "react";
import CustomsTracker from './pages/CustomsTracker.jsx';
import PortActivity from './pages/PortActivity.jsx';
import About from './pages/About.jsx';
import loonie from './assets/loonie.png';

export default function App() {
  const [currentTab, setCurrentTab] = useState("port activity");

  return (
    <MantineProvider>
      <div>
        <header style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
                <h1> Canadian International Trade Dashboard </h1>
                <img src={loonie} alt="Loonie" style={{ width: "100px", height: "100px", marginLeft: "1rem" }} />
        </header>
        
        <nav style={{marginLeft: "2rem"}}>
          <button onClick={() => setCurrentTab("customs tracker")}>Customs Tracker</button>
          <button onClick={() => setCurrentTab("port activity")}>Port Activity</button>
          <button onClick={() => setCurrentTab("about")}>About</button>
        </nav>

        <div style={{ padding: "1rem" }}>
          {currentTab === "customs tracker" && <CustomsTracker />}
          {currentTab === "port activity" && <PortActivity />}
          {currentTab === "about" && (<About />)}
        </div>
      </div>
  </MantineProvider>
  );
}