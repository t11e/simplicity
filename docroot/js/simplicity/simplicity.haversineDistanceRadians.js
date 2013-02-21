/**
 * @name $.simplicity.haversineDistanceRadians
 * @function
 * @description
 *
 * Calculates the haversine distance in radians between two coordinates.
 *
 * @param lat1
 *   The latitude of the first coordinate in degrees.
 * @param lng1
 *   The longitude of the first coordinate in degrees.
 * @param lat2
 *   The latitude of the second coordinate in degrees.
 * @param lng2
 *   The longitude of the second coordinate in degrees.
 * @return
 *   The calculated distance in radians.
 */
(function ($) {
  $.simplicity = $.simplicity || {};
  $.simplicity.haversineDistanceRadians = function (lat1, lng1, lat2, lng2) {
    var degreesToRadians = $.simplicity.degreesToRadians;
    lat1 = degreesToRadians(lat1);
    lng1 = degreesToRadians(lng1);
    lat2 = degreesToRadians(lat2);
    lng2 = degreesToRadians(lng2);
    var dLat = lat2 - lat1;
    var dLng = lng2 - lng1;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return c;
  };
}(jQuery));
