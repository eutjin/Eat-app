/*global kakao*/ 
import React, { useState, useContext, useReducer, useEffect } from "react";

import "./App.css";

// const { kakao } = window;

function Map3() {
  // const { kakao } = window;
  const[visible, setVisible]= useState(false)
  const [coord, setCoord]=useState()
  const [add, setAdd]= useState("")
 


const kakaoMap=()=>{
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3 // 지도의 확대 레벨
  };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch(add, function(result, status) {
console.log(result)
  // 정상적으로 검색이 완료됐으면 
   if (status === kakao.maps.services.Status.OK) {

      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
console.log("coords", coords)
      // 결과값으로 받은 위치를 마커로 표시합니다
      var marker = new kakao.maps.Marker({
          map: map,
          position: coords
      });
     

      // marker.setDraggable(true); 
      marker.setMap(map);

      kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        

        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlng = mouseEvent.latLng; 
        console.log("latlng",latlng)
        console.log(latlng.getLat())
        console.log(latlng.getLng())

        setCoord(latlng)

        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);
        console.log("marker", marker)

        //9/7
        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
          if (status === kakao.maps.services.Status.OK) {
              console.log('그런 너를 마주칠까 ' + result[0].address.address_name + '을 못가');
              console.log("result", result)
          }
      });

        var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
        message += '경도는 ' + latlng.getLng() + ' 입니다';
        console.log(message)

        // var resultDiv = document.getElementById('clickLatlng'); 
        // resultDiv.innerHTML = message;
//start
        var customOverlay = new kakao.maps.CustomOverlay({
          position: latlng
        });
        console.log("o", customOverlay)
      
        var content = document.createElement('div');
        content.className="overlayContainer"
      
        var info = document.createElement('span');
        info.appendChild(document.createTextNode("content"));
        content.appendChild(info);
      
        
      
        kakao.maps.event.addListener(marker, 'click', function() {
          // 마커 위에 인포윈도우를 표시합니다
          customOverlay.setPosition(marker.getPosition())
          customOverlay.setContent(content);
        customOverlay.setMap(map);

        var closeBtn = document.createElement('button');
        closeBtn.appendChild(document.createTextNode('닫기'));
        closeBtn.onclick = function() { customOverlay.setMap(null); };
        content.appendChild(closeBtn);
    });

        
    });

    // var content = document.createElement('div');

    // var info = document.createElement('span');
    // info.appendChild(document.createTextNode("title"));
    // content.appendChild(info);

    // var closeBtn = document.createElement('button');
    // closeBtn.appendChild(document.createTextNode('닫기'));
    // // 닫기 이벤트 추가
    // closeBtn.onclick = function() {
    //     overlay.setMap(null);
    // };

    // content.appendChild(closeBtn);

    // // customoverlay 생성, 이때 map을 선언하지 않으면 지도위에 올라가지 않습니다.
    // var overlay = new kakao.maps.CustomOverlay({
    //     position: coord,
    //     content: content
    // });

    // // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    // kakao.maps.event.addListener(marker, 'click', function() {
    //     overlay.setMap(map);
    // });


      // 인포윈도우로 장소에 대한 설명을 표시합니다
      // var infowindow = new kakao.maps.InfoWindow({
      //     content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
      // });
      // infowindow.open(map, marker);

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
  } 
});    

}
useEffect(()=>{

  kakaoMap()
console.log("ee")
}, [])
useEffect(()=>{
kakaoMap()
}, [add])
  return (
    <>
      
      <div>
        <div id="map" style={{width:"100%", height:"100vh"}}></div>
       
        </div>
        <div>
          <input  type="text"
          id={add}
          
          value={add}
          onChange={(e)=>setAdd(e.target.value)}></input>
        </div>
    </>
  );
}

export default Map3;
