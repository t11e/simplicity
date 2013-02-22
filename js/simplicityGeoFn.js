  /**
   * @name $.simplicityGeoFn
   * @namespace Contains various geographic related utility functions.
   */
(function ($) {
  var degreesToRadians = $.simplicity.degreesToRadians;
  var radiansToDegrees = $.simplicity.radiansToDegrees;
  var geoFn = {
    debug: false
  };
  $.simplicityGeoFn = geoFn;
  /**
   * Returns the (initial) heading from this point to the supplied point, in degrees.
   *
   * @see <a href="http://williams.best.vwh.net/avform.htm#Crs">http://williams.best.vwh.net/avform.htm#Crs</a>
   * @param   [{Number} lat, {Number} lng] p1: First point
   * @param   [{Number} lat, {Number} lng] p2: Second point
   * @returns {Number} Initial heading in degrees from North
   */
  $.simplicityGeoFn.computeHeading = function (p1, p2) {
    var dLonr = degreesToRadians(p2[1] - p1[1]);
    var lat1r = degreesToRadians(p1[0]);
    var lat2r = degreesToRadians(p2[0]);
    var br = Math.atan2(
        Math.sin(dLonr) * Math.cos(lat2r),
        Math.cos(lat1r) * Math.sin(lat2r) - Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(dLonr));
    var result = radiansToDegrees(br);
    if (result < 0) {
      result += 360;
    }
    return result;
  };
  /**
   * Returns the destination point from a point having traveled the given distance (in km) on the
   * given initial bearing (bearing may vary before destination is reached).
   *
   * @see <a href="http://williams.best.vwh.net/avform.htm#LL">http://williams.best.vwh.net/avform.htm#LL</a>
   * @param   [{Number} lat, {Number} lng] p: Point from which to start traveling
   * @param   {Number} dist: Distance in meters
   * @param   {Number} heading: Initial heading in degrees
   * @returns [{Number} lat, {Number} lng] Destination point
   */
  $.simplicityGeoFn.travel = function (p, dist, head) {
    var d = dist / 1000 / 6367; // convert dist to km then to angular distance in radians
    var h = degreesToRadians(head);
    var lat1 = degreesToRadians(p[0]);
    var lon1 = degreesToRadians(p[1]);
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) +
                 Math.cos(lat1) * Math.sin(d) * Math.cos(h));
    var lon2 = lon1 + Math.atan2(Math.sin(h) * Math.sin(d) * Math.cos(lat1),
                 Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
    lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalize to -180..+180º
    return [radiansToDegrees(lat2), radiansToDegrees(lon2)];
  };
  /**
   * Returns the point of intersection of two paths defined by point and heading.
   *
   * @see <a href="http://www.movable-type.co.uk/scripts/latlong.html">http://www.movable-type.co.uk/scripts/latlong.html</a>
   *      <a href="http://williams.best.vwh.net/avform.htm#Intersection">http://williams.best.vwh.net/avform.htm#Intersection</a>
   * @param   [{Number} lat, {Number} lng] p1: First point
   * @param   {Number} heading1: Initial heading from first point
   * @param   [{Number} lat, {Number} lng] p2: Second point
   * @param   {Number} heading2: Initial heading from second point
   */
  $.simplicityGeoFn.intersection = function (p1, heading1, p2, heading2) {
    var lat1 = degreesToRadians(p1[0]);
    var lon1 = degreesToRadians(p1[1]);
    var lat2 = degreesToRadians(p2[0]);
    var lon2 = degreesToRadians(p2[1]);
    var heading13 = degreesToRadians(heading1);
    var heading23 = degreesToRadians(heading2);
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;

    var dist12 = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)));
    if (dist12 === 0) {
      if (geoFn.debug) {
        console.log('dist12', 0);
      }
      return null;
    }

    // initial/final bearings between points
    var headingA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) /
      (Math.sin(dist12) * Math.cos(lat1)));
    if (isNaN(headingA)) {
      headingA = 0; // protect against rounding
    }
    var headingB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) /
      (Math.sin(dist12) * Math.cos(lat2)));

    var heading12, heading21;
    if (Math.sin(lon2 - lon1) > 0) {
      heading12 = headingA;
      heading21 = 2 * Math.PI - headingB;
    } else {
      heading12 = 2 * Math.PI - headingA;
      heading21 = headingB;
    }

    var alpha1 = (heading13 - heading12 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 2-1-3
    var alpha2 = (heading21 - heading23 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 1-2-3

    if (Math.sin(alpha1) === 0 && Math.sin(alpha2) === 0) {
      if (geoFn.debug) {
        console.log('Infinite intersections');
      }
      return null;// infinite intersections
    }
    if (Math.sin(alpha1) * Math.sin(alpha2) < 0) {
      if (geoFn.debug) {
        console.log('Ambiguous intersection');
      }
      return null;  // ambiguous intersection
    }

    //alpha1 = Math.abs(alpha1);
    //alpha2 = Math.abs(alpha2);
    // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?

    var alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) +
                         Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
    var dist13 = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
                         Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3));
    var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) +
                      Math.cos(lat1) * Math.sin(dist13) * Math.cos(heading13));
    var dLon13 = Math.atan2(Math.sin(heading13) * Math.sin(dist13) * Math.cos(lat1),
                         Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
    var lon3 = lon1 + dLon13;
    lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalize to -180..+180º

    return [radiansToDegrees(lat3), radiansToDegrees(lon3)];
  };
}(jQuery));
