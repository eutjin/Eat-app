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

function App() {
  const [isOpen, setIsOpen]= useState(false)
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);


  // const data = [
  //   {
  //     content: <div style={{ color: "#000", padding: "15px", backgroundColor: "red", minWidth:"100%" }} className="pincontainer" onClick={()=>console.log("ww")}>
  //       jjjj
        
  //       </div>,
  //     latlng: {  lat: 37.480142,
  //       lng: 126.881028 },
  //   },
  //   {
  //     content: <div style={{ color: "#000" }}>생태연못</div>,
  //     latlng: {  lat: 37.481242,
  //       lng: 126.882 },
  //   },
  //   {
  //     content: <div style={{ color: "#000" }}>텃밭</div>,
  //     latlng: { lat: 37.478142,
  //       lng: 126.881928 },
  //   },
  //   {
  //     content: <div style={{ color: "#000" }}>근린공원</div>,
  //     latlng: { lat: 37.480142,
  //       lng: 126.879028  },
  //   },
  // ]

  // const EventMarkerContainer = ({ position, content }) => {
  //   const map = useMap()
  //   const [isVisible, setIsVisible] = useState(false)

  //   return (
  //     <MapMarker
  //       position={position} // 마커를 표시할 위치
  //       // @ts-ignore
  //       // onClick={(marker) => map.panTo(marker.getPosition())}
  //       onClick={() => setIsVisible(!isVisible)}
  //       // onMouseOut={() => setIsVisible(false)}
  //     >
  //       {isVisible && content}
  //     </MapMarker>
  //   )
  // }
  
  return (
    <>
      {/* <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 37.480142,
          lng: 126.881028,
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "90vh",
        }}
        level={3} // 지도의 확대 레벨
      >
        <MapMarker // 마커를 생성합니다
          position={{
            // 마커가 표시될 위치입니다
            lat: 37.480142,
          lng: 126.881028,
          }}

          clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
        onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen?<div className="pincontainner">fuck</div>: null }

          </MapMarker>
      </Map> */}
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
          <Text>GunaeSik</Text>
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
     {/* <div >
      <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 37.480142,
        lng: 126.881028,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "90vh",
      }}
      level={4} // 지도의 확대 레벨
    >

      {data.map((value) => (
        <EventMarkerContainer 
        id={value.content}
          key={`EventMarkerContainer-${value.latlng.lat}-${value.latlng.lng}`}
          position={value.latlng}
          content={value.content}
          style={{color: "red"}}
        />
      ))}
    </Map></div> */}
    <Mainmap/>
    </AppShell>
      


    </>
  );
}

export default App;
