/**
 * @name $.simplicity.radiansToDegrees
 * @function
 * @description
 *
 * Converts radians to degrees.
 *
 * @param v
 *   The value to convert, in radians.
 * @return
 *   The converted value in degrees.
 */
(function ($) {
  $.simplicity = $.simplicity || {};
  $.simplicity.radiansToDegrees = function (v) {
    return v * 180 / Math.PI;
  };
}(jQuery));
