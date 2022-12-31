import React, { useState, useContext, useReducer, useEffect } from "react";
import { Map, MapMarker, useMap, CustomOverlayMap, CustomOverlay2Style, MarkerWithCustomOverlayStyle } from "react-kakao-maps-sdk";

function Mainmap(){

    const data = [
        {
          content: <div style={{ color: "#000", padding: "15px", backgroundColor: "red", minWidth:"100%" }} className="pincontainer" onClick={()=>console.log("ww")}>
            jjjj
            
            </div>,
          latlng: {  lat: 37.480142,
            lng: 126.881028 },
        },
        {
          content: <div style={{ color: "#000" }}>생태연못</div>,
          latlng: {  lat: 37.481242,
            lng: 126.882 },
        },
        {
          content: <div style={{ color: "#000" }}>텃밭</div>,
          latlng: { lat: 37.478142,
            lng: 126.881928 },
        },
        {
          content: <div style={{ color: "#000" }}>근린공원</div>,
          latlng: { lat: 37.480142,
            lng: 126.879028  },
        },
      ]
    
      const EventMarkerContainer = ({ position, content }) => {
        const map = useMap()
        const [isVisible, setIsVisible] = useState(false)
    
        return (
          <MapMarker
            position={position} // 마커를 표시할 위치
            // @ts-ignore
            // onClick={(marker) => map.panTo(marker.getPosition())}
            onClick={() => setIsVisible(!isVisible)}
            // onMouseOut={() => setIsVisible(false)}
          >
            {isVisible && content}
          </MapMarker>
        )
      }
      
      return (
        <>
         <div >
      <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 37.480142,
        lng: 126.881028,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "calc(100vh - 45px)",
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
    </Map></div>
    </>
  );
}

export default Mainmap;
