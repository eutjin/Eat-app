/*global kakao*/
import React, { useState, useContext, useReducer, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineCrown,
  AiOutlineStar,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineAim,
  AiOutlineEnvironment,
  AiOutlineUser,
} from "react-icons/ai";
import { useGlobalContext } from "../context";
import "../App.css";
import MapInfo from "./MapInfo";
import MapControlTop from "./MapControlTop";
import MapAddressControl from "./MapAddressControl";
// const { kakao } = window;

function StoreMap() {
  // const { kakao } = window;
  const location = useLocation();
  const {
    vendor,
    setVendor,
    allStores,
    clickedStoreCoord,
    setClickedStoreCoord,
    currentCoord,
    setCurrentCoord,
    nearbyStores,
    setNearbyStores,
    radiusValue,
    setRadiusValue,
    getGeolocation,
    nearbyStores2,
    setNearbyStores2, toggle, setToggle
  } = useGlobalContext();
  const [visible, setVisible] = useState(false);
  // const [coord, setCoord] = useState(location.state);
  // const [coord, setCoord] = useState({ lat: 37.480142, lng: 126.881028 });
  const [add, setAdd] = useState("");
  const [open, setOpen] = useState(false);
  const [radiusControlActive, setRadiusControlActive] = useState(false);
  // const [nearbyStores, setNearbyStores]= useState([])
  // const [currentCoord, setCurrentCoord]= useState({})
  // const [currentCoord, setCurrentCoord]= useState({lat: 37.480142, lng:126.881028})

  //   const data = [
  //     {

  //       title: "title1",
  //       latlng: { lat: 37.480142, lng: 126.881028 },
  //     },
  //     {
  //       title: "title2",
  //       latlng: { lat: 37.481242, lng: 126.882 },
  //     },
  //     {
  //       title: "title3",
  //       latlng: { lat: 37.478142, lng: 126.881928 },
  //     },
  //     {
  //       title: "title4",
  //       latlng: { lat: 37.480142, lng: 126.879028 },
  //     },
  //   ];

  console.log("stores", allStores);
  //   console.log("state", location.state)
  //   useEffect(()=>{
  //     if(location.state){
  //       setCoord(location.state)
  //     }
  // console.log("locationSatte", location.state)
  //   }, [])

  // useEffect(()=>{

  // }, [])

  //   useEffect(()=>{
  //     if(location.state){
  //       setCoord(location.state)
  //     }

  //   }, [location])

  useEffect(() => {
    kakaoMap();
    // setNearbyStores([])
  }, [clickedStoreCoord, currentCoord]);

  useEffect(() => {
    let currentPosition = new kakao.maps.LatLng(
      currentCoord.lat,
      currentCoord.lng
    );
    console.log("p1", currentPosition);

    let nearbyStore2 = [];
    allStores.forEach((item) => {
      let storePosition = new kakao.maps.LatLng(
        item.storeCoordinate.lat,
        item.storeCoordinate.lng
      );

      const poly = new kakao.maps.Polyline({
        path: [currentPosition, storePosition],
      });

      let distance = poly.getLength();
      // console.log("distance", distance)

      let itemMod = { ...item, distance };
      // console.log("mess", itemMod)
      if (distance < radiusValue) {
        nearbyStore2.push(itemMod);
      }
    });
    console.log("888", nearbyStore2);
    setNearbyStores2(nearbyStore2);
  }, [currentCoord, radiusValue]);

  // useEffect(() => {
  //   kakaoMap();
  //   // setNearbyStores([])
  // }, [coord, clickedStoreCoord, currentCoord]);

  useEffect(() => {
    setNearbyStores([]);
    kakaoMap();
  }, [radiusValue]);

  useEffect(() => {
    getGeolocation();
  }, []);

  // const getGeolocation=()=>{
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(success, error, options);
  //   }
  // }

  //   const success = (position) => {
  //     console.log("position", position.coords.latitude);
  //     setCurrentCoord({
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude,
  //     });
  //   };

  //   function error(err) {
  //     console.warn(`ERROR(${err.code}): ${err.message}`);
  //   }

  //   var options = {
  //     enableHighAccuracy: true,
  //     timeout: 5000,
  //     maximumAge: 1,
  //   };

  var clickedOverlay = null;
  var clickedMarker = null;
  var isOpen = false;

  let markers = [];

  const setCenter = () => {
    if (clickedStoreCoord.lat) {
      console.log("meiyo");
      return new kakao.maps.LatLng(
        clickedStoreCoord.lat,
        clickedStoreCoord.lng
      );
    } else if (currentCoord.lat && currentCoord.lng) {
      console.log("has current coord");
      return new kakao.maps.LatLng(currentCoord.lat, currentCoord.lng);
    } else {
      console.log("no current coord");
      return new kakao.maps.LatLng(37.480142, 126.879028);
    }

    // return new kakao.maps.LatLng(37.49669760222137,126.91492643251343)
  };
  const kakaoMap = () => {
    console.log("map rendered");
    var mapContainer = document.getElementById("map"), // ????????? ????????? div
      mapOption = {
        center: setCenter(),
        // center: new kakao.maps.LatLng(37.480142, 126.879028), // ????????? ????????????
        level: 4, // ????????? ?????? ??????
      }; //hereee changed

    console.log("mapContainer", mapContainer);
    console.log("mapOption", mapOption);
    // var mapContainer = document.getElementById("map"), // ????????? ????????? div
    // mapOption = {
    //   center: new kakao.maps.LatLng(coord.lat, coord.lng), // ????????? ????????????
    //   level: 4, // ????????? ?????? ??????
    // };

    // ????????? ???????????????a
    var map = new kakao.maps.Map(mapContainer, mapOption);

    const zoomIn = () => {
      var level = map.getLevel();
      // ????????? 1?????? ???????????? (????????? ???????????????)
      map.setLevel(level - 1);
    };

    const zoomOut = () => {
      var level = map.getLevel();
      // ????????? 1?????? ???????????? (????????? ???????????????)
      map.setLevel(level + 1);
    };
    function panTo() {
      // ????????? ?????? ?????? ????????? ???????????????
      var moveLatLon = new kakao.maps.LatLng(
        currentCoord.lat,
        currentCoord.lng
      );

      // ?????? ????????? ???????????? ??????????????????
      // ?????? ????????? ????????? ?????? ???????????? ?????? ???????????? ?????? ?????? ???????????????
      map.panTo(moveLatLon);
    }

    const handleGeolocationButton = () => {
      getGeolocation();
      setClickedStoreCoord({});
    };

    document.getElementById("zoomIn").addEventListener("click", zoomIn);
    document.getElementById("zoomOut").addEventListener("click", zoomOut);
    document.getElementById("centerMap").addEventListener("click", panTo);
    document
      .getElementById("geolocationMap")
      .addEventListener("click", handleGeolocationButton);


      kakao.maps.event.addListener(map, 'bounds_changed', function() {
        map.relayout();
        // map.panTo(map.getCenter());
    });

    // var zoomContainer= document.createElement("div");
    // zoomContainer.className="zoomContainer";

    // var zoomInBtn= document.createElement("div")
    // zoomInBtn.className= "zoomInBtn";
    // zoomInBtn.appendChild(document.createTextNode("+"));
    // zoomContainer.appendChild(zoomInBtn)

    // var zoomInBtn= document.createElement("div")
    // zoomInBtn.className= "zoomInBtn";
    // zoomInBtn.appendChild(document.createTextNode("+"));
    // zoomContainer.appendChild(zoomInBtn)

    // //fake maerker
    // let markerCenter = new kakao.maps.Marker({
    //   map: map,
    //   position: new kakao.maps.LatLng(37.480142, 126.879028),
    // });

    //fake maerker
    // var customOverlayFake = new kakao.maps.CustomOverlay({
    //   content: content,
    //   position: markerCenter.getPosition(),
    //   yAnchor: 1.5,
    //   zIndex: 1000,
    // });

    // let refMarker= new kakao.maps.Marker({
    //   map: map,
    //   position: new kakao.maps.LatLng(
    //     coord.lat,
    //     coord.lng
    //   ),
    // })
    // console.log("refMarker", refMarker.getPosition())
    const userImage = require("../assets/userPosition.png");

    var imageSrc = userImage, // ?????????????????? ???????????????
      imageSize = new kakao.maps.Size(32, 43), // ?????????????????? ???????????????
      imageOption = { offset: new kakao.maps.Point(27, 69) };

    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // let currentPosMarker = new kakao.maps.Marker({
    //   map: map,
    //   position: new kakao.maps.LatLng(37.49669760222137,126.91492643251343),
    //   image: markerImage,
    // });
    let currentPosMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(currentCoord.lat, currentCoord.lng),
      image: markerImage,
      zIndex: 1000,
    });

    currentPosMarker.setMap(map);
    currentPosMarker.setDraggable(true);
    kakao.maps.event.addListener(currentPosMarker, "dragend", function () {
      console.log("we", currentPosMarker.getPosition());
      setCurrentCoord({
        lat: currentPosMarker.getPosition().Ma,
        lng: currentPosMarker.getPosition().La,
      });
    });
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map, // ???????????? ??????????????? ???????????? ????????? ?????? ??????
      averageCenter: true, // ??????????????? ????????? ???????????? ?????? ????????? ???????????? ?????? ????????? ??????
      minLevel: 6, // ???????????? ??? ?????? ?????? ??????
    });

    let nearbyStoreArr = [];
    //all shop markers
    allStores.forEach((item) => {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(
          item.storeCoordinate.lat,
          item.storeCoordinate.lng
        ),
      });
      console.log("marker", marker);
      console.log("markerZ", item);
      marker.setMap(map);

      markers.push(marker); // for marker clusterer, as it requires an array of markers instead of single marker

      const poly = new kakao.maps.Polyline({
        path: [currentPosMarker.getPosition(), marker.getPosition()],
      });

      let dist = poly.getLength();
      console.log("getLength", dist);

      console.log("out2", radiusValue);
      if (dist < radiusValue) {
        console.log("getback", item._id);

        //prevent duplicate as loop run for 4 times (not sure)
        // if(!nearbyStores.includes(item._id)){
        //   setNearbyStores((nearbyStores)=>[...nearbyStores, item])
        // }

        // if(!nearbyStores.some(e => e._id ==item._id)){
        //   setNearbyStores((nearbyStores)=>[...nearbyStores, item])
        // }

        // if(!nearbyStores.some(e => e._id ==item._id)){
        //  nearbyStoreArr.push(item)
        // }
        nearbyStoreArr.push(item);
      }

      // //test@
      // const poly= new kakao.maps.Polyline({
      //   path: [markerCenter.getPosition(), marker.getPosition()]
      // })

      // var dist = poly.getLength()
      // console.log("getLength", dist)

      //content
      var box = document.createElement("div");
      box.className = "box";
      var content = document.createElement("div");
      content.className = "overlayContainer";
      box.appendChild(content);

      var boxTail = document.createElement("div");
      boxTail.className = "boxTail";
      box.appendChild(boxTail);

      var header = document.createElement("div");
      header.className = "overlayHeader";
      content.appendChild(header);

      var info = document.createElement("span");
      info.className = "overlayTitle";
      info.appendChild(document.createTextNode(item.storeName));
      header.appendChild(info);

      var closeBtn = document.createElement("button");
      closeBtn.className = "closeBtn";

      closeBtn.onclick = function () {
        customOverlay.setMap(null);
        console.log("closss");
      };
      header.appendChild(closeBtn);

      var header2 = document.createElement("div");
      header2.className = "overlayHeader2";
      content.appendChild(header2);

      var reviewVal = document.createElement("span");
      reviewVal.className = "reviewVal";
      reviewVal.appendChild(
        document.createTextNode(
          "??????  " + " " + parseFloat(item.storeRatingVal).toFixed(1)
        )
      );
      header2.appendChild(reviewVal);

      var reviewValStar = document.createElement("span");
      reviewValStar.className = "reviewValStar";
      header2.appendChild(reviewValStar);

      var reviewQty = document.createElement("span");
      reviewQty.className = "reviewQty";
      reviewQty.appendChild(
        document.createTextNode("??????  " + item.storeRatingQty)
      );
      header2.appendChild(reviewQty);

      var body = document.createElement("div");
      body.className = "overlayBody";
      content.appendChild(body);

      var info2 = document.createElement("span");
      info2.className = "overlayAdd";
      info2.appendChild(document.createTextNode(item.storeAddress));
      body.appendChild(info2);

      var info2a = document.createElement("span");
      info2a.className = "overlayPhone";
      info2a.appendChild(document.createTextNode(item.storePhone));
      body.appendChild(info2a);

      var info3 = document.createElement("button");
      info3.className = "link";
      var a = document.createElement("a");
      var linkText = document.createTextNode("To Store");
      a.appendChild(linkText);
      a.title = "my title text";
      a.href = `http://localhost:3000/eats/${item._id}`;
      info3.appendChild(a);
      content.appendChild(info3);

      //       var overlayParent=content.parentNode
      //   overlayParent.className="overlayParent"

      var customOverlay = new kakao.maps.CustomOverlay({
        content: box,
        position: marker.getPosition(),
        yAnchor: 1.2,
        zIndex: 10000,
      });
      // console.log("o", customOverlay)

      // var customOverlay2 = new kakao.maps.CustomOverlay({
      //   content: content,
      //   position: marker2.getPosition(), yAnchor: 1.5,  zIndex: 1000,
      // });

      // customOverlay2.setMap(map);

      if (
        clickedStoreCoord.lat == item.storeCoordinate.lat &&
        clickedStoreCoord.lng == item.storeCoordinate.lng
      ) {
        console.log("clikyclik");
        clickedOverlay = customOverlay;
        customOverlay.setMap(map);
        isOpen = true;
      }

      kakao.maps.event.addListener(marker, "click", function () {
        // customOverlay.setMap(map);
        // // kakao.maps.event.preventMap();
        // var po= customOverlay.getVisible();
        // console.log("po", po)
        // setClickedStoreCoord({})
        console.log("customOverlay1", customOverlay.n);
        console.log("open", open);

        map.panTo(marker.getPosition());


        //ori fixed
        console.log("marker2", marker);
        if (clickedOverlay == customOverlay && isOpen == true) {
          console.log("clickedOverlay", clickedOverlay);
          customOverlay.setMap(null);
          isOpen = false;

          console.log("run1");
        } else if (clickedOverlay && clickedOverlay != customOverlay) {
          console.log("clickedOverlay", clickedOverlay);
          clickedOverlay.setMap(null);
          customOverlay.setMap(map);
          isOpen = true;
          console.log("run2");
        } else if (isOpen == false) {
          customOverlay.setMap(map);
          isOpen = true;
          // console.log("isopen", isOpen)
          console.log("run3");
        }

        clickedOverlay = customOverlay;
        console.log("clickedOverlay", clickedOverlay.n);
        console.log("customOverlay", customOverlay.n);
        console.log("isOpen ", isOpen);
      });

      // kakao.maps.event.addListener(map, "click", function (e) {
      //   console.log("dont!", e);
      //   if (clickedOverlay) {
      //     clickedOverlay.setMap(null);
      //     isOpen = false;
      //   }
      // });

      //GOLDEN
      // console.log("run1", refMarker.getPosition() )
      // console.log("run2", marker.getPosition())
      // if(refMarker.getPosition().equals(marker.getPosition())){
      //   console.log("run")
      //   customOverlay.setMap(map);
      //   isOpen=true;
      // }

      // kakao.maps.event.addListener(marker, "click", function () {
      //   // customOverlay.setMap(map);
      //   // // kakao.maps.event.preventMap();
      //   // var po= customOverlay.getVisible();
      //   // console.log("po", po)

      //   //ori
      //   console.log("marker2", marker);
      //   if (clickedOverlay ) {
      //     console.log('clickedOverlay', clickedOverlay)
      //     clickedOverlay.setMap(null);
      //     // clickedOverlay=null
      //   }

      //   // if(clickedOverlay && clickedMarker==marker){
      //   //   clickedOverlay.setMap(null);
      //   //   console.log("jj")
      //   // }

      //   customOverlay.setMap(map);

      //   clickedOverlay = customOverlay;
      //   console.log("clickedOverlay", clickedOverlay.n);
      //   console.log("customOverlay", customOverlay.n);
      // });
    });
    console.log("out3", nearbyStoreArr);
    setNearbyStores(nearbyStoreArr);

    clusterer.addMarkers(markers);
  };

  useEffect(() => {
    kakaoMap();
    console.log("ee");
  }, [allStores]);

  //   useEffect(() => {
  //     kakaoMap();
  //   }, [add]);
  return (
    <div className="mapPage">
      <div id="map" className={toggle? "kakaoMapSmall":"kakaoMap"}></div>
      <MapInfo />
      <MapControlTop radiusControlActive={radiusControlActive} setRadiusControlActive={setRadiusControlActive}/>
      <MapAddressControl radiusControlActive={radiusControlActive} setRadiusControlActive={setRadiusControlActive}/>
      <div className="mapZoomButtons">
        <div id="zoomIn" className="zoomButtonIn">
          <AiOutlinePlus size={24} />
        </div>
        <div id="zoomOut" className="zoomButtonOut">
          {" "}
          <AiOutlineMinus size={24} />
        </div>
      </div>

      <div id="centerMap" className="centerMap">
        {" "}
        <AiOutlineUser size={24} />
      </div>
      <div id="geolocationMap" className="geolocationMap">
        {" "}
        <AiOutlineAim size={24} />
      </div>
      {/* <div>
        <input
          type="text"
          id={add}
          value={add}
          onChange={(e) => setAdd(e.target.value)}
        ></input>
      </div> */}
    </div>
  );
}

export default StoreMap;
