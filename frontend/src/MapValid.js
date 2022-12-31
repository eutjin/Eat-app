import React, { useState, useContext, useReducer, useEffect } from "react";

import "./App.css";

const { kakao } = window;

function MapValid({coordinate}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    var mapContainer = document.getElementById("map"), // 지도의 중심좌표
      mapOption = {
        center: new kakao.maps.LatLng(coordinate.Ma, coordinate.La), // 지도의 중심좌표
        level: 2, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 지도에 마커를 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(coordinate.Ma, coordinate.La),
    });

   
  }, [coordinate]);

  return (
    <>
      <div>
        <div id="map" style={{ width: "100%", height: "50vh" }}></div>
      </div>
    </>
  );
}

export default MapValid;
