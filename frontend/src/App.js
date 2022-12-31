import React, { useState, useContext, useReducer, useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  Routes,
} from "react-router-dom";
import {
  Map,
  MapMarker,
  useMap,
  CustomOverlayMap,
  CustomOverlay2Style,
  MarkerWithCustomOverlayStyle,
} from "react-kakao-maps-sdk";
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar,
} from "react-icons/ai";

import {
  AppShell,
  Drawer,
  Navbar,
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
import AddStore from "./components/AddStore";
import Store from "./routes/Store";
import AddMenu from "./components/AddMenu";
import EditMenu from "./components/EditMenu";
import List from "./routes/List";
import HeaderTop from "./components/HeaderTop";
import Map2 from "./Map2";
import Map3 from "./Map3";
import Map4 from "./Map4";
import StoreMap from "./components/StoreMap";
import MapInfo from "./components/MapInfo";
// import AddressSearch from "./components/AddressSearch";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  console.log(window.location.pathname)
  return (
    <div className="appBackground">
      {/* <Header p="md" className="header">
            <div className="navbar">
              <Text>GunaeSik</Text>
              <MediaQuery  styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                />
                
              </MediaQuery>
            </div>
          </Header> */}
      <HeaderTop />
      {/* <Drawer position="right" withCloseButton={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Register"
        padding="xl"
        size="sm"
      ></Drawer> */}
      <div className={window.location.pathname==='/'? "container2":"container"}>
        <Routes>
          {/* <Route exact path="/" element={<Mainmap />}/> */}
          <Route path="/about" element={<About />} />
          <Route path="/about/:id" element={<Store />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/eats" element={<Restaurants />} />
          <Route path="/store" element={<AddStore />} />
          <Route path="/addmenu/:id" element={<AddMenu />} />
          <Route path="/editmenu/" element={<EditMenu />} />
          <Route path="/eats/:id" element={<RestaurantDetail />} />
          <Route path="/list" element={<List />} />
          <Route path="/map" element={<Map2 />} />
          <Route path="/3" element={<Map3 />} />
          <Route path="/4" element={<Map4 />} />
          <Route path="/" element={<StoreMap />} />
          <Route path="/:id" element={<StoreMap />} />
          {/* <Route path="/add" element={<AddressSearch/>}/> */}
        </Routes>
        <Drawer
          position="right"
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
          title="Register"
          padding="xl"
          size="sm"
        ></Drawer>
        {/* <div className="infoContainer">fff</div> */}
        
        {/* <MapInfo/> */}
      </div>

      <Footer className="footer">
        <Link id="jj1" to="/" onClick={(e) => console.log(e.currentTarget.id)}>
          <div className="footerButton">
            <div className="footerIcon">
              <AiOutlineHome size={28} />
            </div>
            <Text size={12}>Home</Text>
          </div>{" "}
        </Link>
        <div>
          <Link to="/eats">
            <div>
              <AiOutlineHome />
            </div>
            <div>Eats</div>
          </Link>
        </div>
        <div>
          <Link to="/about">
            <div>
              <AiOutlineHome />
            </div>
            <div>About</div>
          </Link>
        </div>
        <div>
          <Link to="/login">
            <div>
              <AiOutlineHome />
            </div>
            <div>Login</div>
          </Link>
        </div>
      </Footer>
    </div>
  );
}

export default App;
