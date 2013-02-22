/**
 * @name $.simplicity.ajaxHelper
 * @function
 * @description
 *
 * Plugin to manage asynchronous ajax requests such that only the most
 * recent request is currently inflight. Any inflight request will be
 * aborted, leaving only the most recent request to complete.
 *
 * The helper class also keeps track of total requests, success and error
 * counts. These statistics are available using the .getStats() method.
 *
 * @param exeContext
 *   The target <code>Object</code> to use for the context of the supplied
 *   $.ajax() success and error callback options.
 *
 * @example
 *   var ajaxHelper = new $.simplicity.ajaxHelper(this);
 *   var xhr = ajaxHelper.ajax({
 *     url: '/my_search_controller.php',
 *     type: 'GET',
 *     contentType: 'application/json',
 *     error: function (data, textStatus, xhr) {...},
 *     success: function (data, textStatus, xhr) {...},
 *     debug: false
 *   });
 *   console.log(ajaxHelper.getStats());
 */
(function ($) {
  $.simplicity = $.simplicity || {};
  $.simplicity.ajaxHelper = function (exeContext) {
    var numRequest = 0,
        numSuccess = 0,
        numError = 0,
        numSuperceed = 0,
        numAbort = 0,
        inFlightXhr = null;
    var ajax = function (options) {
      function requestSuccess(requestId) {
        return function (data, textStatus, xhr) {
          inFlightXhr = null;
          if (requestId !== numRequest) {
            if (options.debug) {
              console.log('Successful Ajax response superceded with requestId ', requestId, ', current request', numRequest);
            }
          } else {
            if (data === null || ('undefined' === typeof data)) {
              numError += 1;
              if (options.error !== null && ('undefined' !== typeof options.error)) {
                options.error.apply(this, arguments);
              }
            } else {
              numSuccess += 1;
              if (options.success !== null && ('undefined' !== typeof options.success)) {
                options.success.apply(this, arguments);
              }
            }
          }
        };
      }
      function requestError(requestId) {
        return function (data, textStatus, xhr) {
          inFlightXhr = null;
          if (xhr.status === 0 && textStatus === 'abort') {
            numAbort += 1;
            if (options.debug) {
              console.log('Ajax call aborted with requestId ', requestId, ', current request', numRequest);
            }
          } else if (requestId !== numRequest) {
            numSuperceed += 1;
            if (options.debug) {
              console.log('Ajax error response superceeded with requestId ', requestId, ', current request', numRequest);
            }
          } else {
            numError += 1;
            if (options.error !== null && ('undefined' !== typeof options.error)) {
              options.error.apply(this, arguments);
            }
          }
        };
      }
      numRequest += 1;
      if (inFlightXhr) {
        inFlightXhr.abort();
      }
      var callbacks = {
        success: $.proxy(requestSuccess(numRequest), exeContext),
        error: $.proxy(requestError(numRequest), exeContext)
      };
      var ajaxOptions = $.extend({}, options, callbacks);
      inFlightXhr = $.ajax(ajaxOptions);
      return inFlightXhr;
    };
    return {
      ajax: ajax,
      getStats: function () {
        return {
          count: numRequest,
          success: numSuccess,
          error: numError,
          superceed: numSuperceed,
          abort: numAbort
        };
      }
    };
  };
}(jQuery));
