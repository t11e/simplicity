/**
 * @name $.simplicity.haversineDistanceKm
 * @function
 * @description
 *
 * Calculates the haversine distance in km between two coordinates.
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
  $.simplicity.haversineDistanceKm = function (lat1, lng1, lat2, lng2) {
    return 6367 * $.simplicity.haversineDistanceRadians(lat1, lng1, lat2, lng2);
  };
}(jQuery));
