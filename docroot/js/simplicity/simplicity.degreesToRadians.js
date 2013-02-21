/**
 * @name $.simplicity.degreesToRadians
 * @function
 * @description
 *
 * Converts degrees to radians.
 *
 * @param v
 *   The value to convert, in degrees.
 * @return
 *   The converted value in radians.
 */
(function ($) {
  $.simplicity = $.simplicity || {};
  $.simplicity.degreesToRadians = function (v) {
    return v * Math.PI / 180.0;
  };
}(jQuery));
