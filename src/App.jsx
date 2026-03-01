// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import {AppShell, Tabs, Flex} from '@mantine/core';
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
      <AppShell >
        <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            gap="md"
            p="md"
          >
            <Flex align="center" gap="md" >
              <h3 style={{ margin: 0 }}>Canadian International Trade Dashboard</h3>
              <img
                src={loonie}
                alt="Loonie"
                style={{ width: "25px", height: "25px" }}
              />
            </Flex>
            <Tabs
              defaultValue="port activity"
              onChange={setCurrentTab}
              style={{ flex: 1, width: "100%", height: "100%" }}
            >
              <Tabs.List grow>
                <Tabs.Tab value="customs tracker" fw={500}>
                  Customs Tracker
                </Tabs.Tab>
                <Tabs.Tab value="port activity" fw={500}>
                  Port Activity
                </Tabs.Tab>
                <Tabs.Tab value="about" fw={500}>
                  About
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Flex>
        <AppShell.Main>
          <div>
            {currentTab === "customs tracker" && <CustomsTracker />}
            {currentTab === "port activity" && <PortActivity />}
            {currentTab === "about" && (<About />)}
          </div>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}