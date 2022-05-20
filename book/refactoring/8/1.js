/**
 * 리팩터링 함수 옮기기
 */
function trackSummary(points) {
  const totalTime = calculateTime();
  // const totalDistance = top_calculateDistance(points);
  const pace = totalTime / 60 / top_calculateDistance(points);
  return {
    time : totalTime,
    distance: totalDistance,
    pace: pace
  }
  // function calculateDistance() {
  //   // let result = 0;
  //   // for (let i = 0; i < points.length; i++) {
  //   //   result += distance(points[i-1], points[i]);
  //   // }
  //   // return result;

  //   // function distance(p1, p2) {// trackSummary 아래 있던 걸 calculateDistance로 옮김
  //   //   const EARTH_RADIUS = 3959;
  //   //   const dLat = radians(p2.lat) - radians(p1.lat);
  //   //   const dLon = radians(p2.lon) - radians(p1.lon);
  //   //   const a = Math.pow(Math.sin(dLat / 2), 2)
  //   //           + Math.cos(radians(p2.lat))
  //   //           + Math.cos(radians(p1.lat))
  //   //           + Math.pow(Math.sin(dLon / 2), 2);
  //   //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  //   //   return EARTH_RADIUS * c;
  //   // }
  //   // function radians(degrees) {// trackSummary 아래 있던 걸 calculateDistance로 옮김
  //   //   return degrees * Math.PI / 180;
  //   // }
  //   return top_calculateDistance(points);
  // }
  function calculateTime() {

  }
}
function top_calculateDistance(points) {
  let result = 0;
  for (let i = 0; i < points.length; i++) {
    result += distance(points[i-1], points[i]);
  }
  return result;

  function distance(p1, p2) {
    const EARTH_RADIUS = 3959;
    const dLat = radians(p2.lat) - radians(p1.lat);
    const dLon = radians(p2.lon) - radians(p1.lon);
    const a = Math.pow(Math.sin(dLat / 2), 2)
            + Math.cos(radians(p2.lat))
            + Math.cos(radians(p1.lat))
            + Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return EARTH_RADIUS * c;
  }
  function radians(degrees) {
    return degrees * Math.PI / 180;
  }
  
}