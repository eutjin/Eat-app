/*global kakao*/
import React, { useState, useContext, useReducer, useEffect } from "react";
import { AiOutlineHome, AiOutlineHeart, AiOutlineCrown, AiOutlineStar, } from "react-icons/ai";
import "./App.css";

// const { kakao } = window;

function Map4() {
  // const { kakao } = window;
  const [visible, setVisible] = useState(false);
  const [coord, setCoord] = useState();
  const [add, setAdd] = useState("");
  const data = [
    {

      title: "title1",
      latlng: { lat: 37.480142, lng: 126.881028 },
    },
    {
      title: "title2",
      latlng: { lat: 37.481242, lng: 126.882 },
    },
    {
      title: "title3",
      latlng: { lat: 37.478142, lng: 126.881928 },
    },
    {
      title: "title4",
      latlng: { lat: 37.480142, lng: 126.879028 },
    },
  ];

  var clickedOverlay = null;
  const kakaoMap = () => {
    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.480142, 126.881028), // 지도의 중심좌표
        level: 4, // 지도의 확대 레벨
      };

    // 지도를 생성합니다a
    var map = new kakao.maps.Map(mapContainer, mapOption);

    data.forEach((item) => {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(item.latlng.lat, item.latlng.lng),
      });
      marker.setMap(map);
      console.log("marker", marker)

      
    
      //content
      var content = document.createElement('div');
      content.className="overlayContainer"
    
      var info = document.createElement('span');
      info.className="overlayTitle"
      info.appendChild(document.createTextNode("content"));
      content.appendChild(info);

      var info2 =document.createElement('span');
      info2.className="overlayTitle"
      var a = document.createElement('a');
      var linkText = document.createTextNode(item.title);
      a.appendChild(linkText);
      a.title = "my title text";
      a.href = "http://example.com";
      info2.appendChild(a);
      content.appendChild(info2)

      var closeBtn = document.createElement('button');
      closeBtn.className= "closeBtn"
      // var closeIcon= document.createElement('i')
      // closeIcon.className= "fa-regular fa-xmark"
      // closeBtn.appendChild(closeIcon);
      closeBtn.appendChild(document.createTextNode('닫기'));
      closeBtn.onclick = function() { customOverlay.setMap(null); console.log("closss")};
      content.appendChild(closeBtn);

      var customOverlay = new kakao.maps.CustomOverlay({
        content: content, 
        position: marker.getPosition(), yAnchor 	: 1.8,  zIndex: 1000
      });
      console.log("o", customOverlay)

      kakao.maps.event.addListener(marker, 'click', function() {
        // customOverlay.setMap(map);
        // // kakao.maps.event.preventMap();
        // var po= customOverlay.getVisible();
        // console.log("po", po)
        if (clickedOverlay) {
          clickedOverlay.setMap(null);
      }
    
      customOverlay.setMap(map);
      clickedOverlay = customOverlay;
    });

    // kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    //     customOverlay.setMap(null);
    //     console.log(mouseEvent)
    // });

    });
  };

  useEffect(() => {
    kakaoMap();
    console.log("ee");
  }, []);

  //   useEffect(() => {
  //     kakaoMap();
  //   }, [add]);
  return (
    <>
      <div>
        <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      </div>
      {/* <div>
        <input
          type="text"
          id={add}
          value={add}
          onChange={(e) => setAdd(e.target.value)}
        ></input>
      </div> */}
    </>
  );
}

export default Map4;
