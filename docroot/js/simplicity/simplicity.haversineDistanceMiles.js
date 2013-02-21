/**
 * @name $.simplicity.haversineDistanceMiles
 * @function
 * @description
 *
 * Calculates the haversine distance in miles between two coordinates.
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
 *   The calculated distance in miles.
 */
(function ($) {
  $.simplicity = $.simplicity || {};
  $.simplicity.haversineDistanceMiles = function (lat1, lng1, lat2, lng2) {
    return 3956 * $.simplicity.haversineDistanceRadians(lat1, lng1, lat2, lng2);
  };
}(jQuery));
