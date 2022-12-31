import React, { useState, useContext, useReducer, useEffect } from "react";
import { Map, MapMarker, useMap, CustomOverlayMap, CustomOverlay2Style, MarkerWithCustomOverlayStyle } from "react-kakao-maps-sdk";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import "./App.css";
import Mainmap from "./components/Mainmap";

function Navbar() {
  const [isOpen, setIsOpen]= useState(false)
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);


  
  
  return (
    <>
      
       <AppShell classNames={{main: "appshell"}}
      
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} classNames={{root: "navbarside"}}>
          <Text>Application navbar</Text>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text>Application sidebar</Text>
          </Aside>
        </MediaQuery>
      }
      footer={
        <Footer p="md" className="footer">
          Application footer
        </Footer>
      }
      header={
        <Header height={70} p="md" className="header">
          <div className="navbar">
          <Text>구내식</Text>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                
              />
            </MediaQuery>

            
          </div>
        </Header>
      }
    >
     
    <Mainmap/>
    </AppShell>
      


    </>
  );
}

export default Navbar;
