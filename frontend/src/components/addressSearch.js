/*global kakao*/

export function addressSearch(add, cb) {

  console.log("add", add);
  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(add, function (result, status) {
    console.log(result, status);
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
      if (result[0].road_address) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        console.log("coordsA", coords);

        return cb(coords);
      } else {
        return cb("INVALID_ADD_LENGTH");
      }
    } else {
      return cb("INVALID_ADD");
    }
  });
}
