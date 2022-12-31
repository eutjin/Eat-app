import React, { useState, useContext, useReducer, useEffect } from "react";
import {BrowserRouter as Router, Link, Switch, Route, Routes} from "react-router-dom";
import {
  Map,
  MapMarker,
  useMap,
  CustomOverlayMap,
  CustomOverlay2Style,
  MarkerWithCustomOverlayStyle,
} from "react-kakao-maps-sdk";
import { AiOutlineHome, AiOutlineHeart, AiOutlineCrown, AiOutlineStar, } from "react-icons/ai";

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
} from "@mantine/core";
import "./App.css";
import Mainmap from "./components/Mainmap";
import About from "./routes/About";
import Login from "./routes/Login";
import Restaurants from "./routes/Restaurants";
import RestaurantDetail from "./routes/RestaurantDetail";
import Register from "./routes/Register";
import AddStore from "./components/AddStore"
import Store from "./routes/Store"
import AddMenu from "./components/AddMenu"

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <AppShell
        classNames={{ main: "appshell" }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            classNames={{ root: "navbarside" }}
          >
            <Text>Application navbar</Text>
          </Navbar>
        }
        aside={
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
              <Text>Application sidebar</Text>
            </Aside>
          </MediaQuery>
        }
        footer={
          <Footer p="md" className="footer">
            <div>
              <Link to="/">
              <div><AiOutlineHome/></div>
              <div>Home</div>
              </Link>
            </div>
            <div>
              <Link to="/eats">
              <div><AiOutlineHome/></div>
              <div>Eats</div>
              </Link>
            </div>
            <div>
              <Link to="/about">
              <div><AiOutlineHome/></div>
              <div>About</div>
              </Link>
            </div>
            <div>
              <Link to="/login">
              <div><AiOutlineHome/></div>
              <div>Login</div>
              </Link>
            </div>
          </Footer>
        }
        header={
          <Header height={70} p="md" className="header">
            <div className="navbar">
              <Text>GunaeSik</Text>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
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
        <div className="container">
         
        
    <Routes>
      <Route exact path="/" element={<Mainmap />}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/about/:id" element={<Store/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/eats" element={<Restaurants/>}/>
      <Route path="/store" element={<AddStore/>}/>
      <Route path="/addmenu/:id" element={<AddMenu/>}/>
      <Route path="/eats/:id" element={<RestaurantDetail/>}/>
    </Routes>
  
  </div>
      </AppShell>
    </>
  );
}

export default App;
