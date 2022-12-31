import React, { useState, useContext, useReducer, useEffect } from "react";

import "./App.css";

const { kakao } = window;

function MapPositionCheck({coordinate, setCurrentCoordLocal}) {
  const [visible, setVisible] = useState(false);

  console.log("mapos", coordinate)
  useEffect(() => {
    var mapContainer = document.getElementById("map2"), // 지도의 중심좌표
      mapOption = {
        center: new kakao.maps.LatLng(coordinate.lat, coordinate.lng), // 지도의 중심좌표
        level: 2, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 지도에 마커를 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: map.getCenter()
    });

    var box = document.createElement("div");
      box.className = "box";
      var content = document.createElement("div");
      content.className = "overlayContainer";
      box.appendChild(content);

      var info = document.createElement("span");
      info.className = "overlayTitle";
      info.appendChild(document.createTextNode("Move the map to set the address"));
      content.appendChild(info);

    var customOverlay = new kakao.maps.CustomOverlay({
      content: box,
      position: map.getCenter(),
      yAnchor: 2.5,
      zIndex: 10000,
    });
    customOverlay.setMap(map);

    kakao.maps.event.addListener(map, 'drag', function() {        
    marker.setPosition( map.getCenter())
    customOverlay.setPosition( map.getCenter())
      // 지도 중심좌표를 얻어옵니다 
      var latlng = map.getCenter(); 
      
    console.log(latlng)
   
    setCurrentCoordLocal({lat: latlng.Ma, lng: latlng.La})
  });
   
  }, []);

  return (
    <>
      <div>
        <div id="map2" style={{ width: "100%", height: "60vh" }}></div>
      </div>
    </>
  );
}

export default MapPositionCheck;
