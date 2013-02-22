/**
 * @name $.ui.simplicityNokiaMap
 * @namespace A Nokia map.
 * <p>
 * Nokia Map widget. Wraps a Nokia map as a jquery ui widget. Will optionally create a map, or a map can be
 * passed in using the widget options.
 *
 * @example
 *   &lt;div id="map" style="width: 300px; height: 300px;">&lt;/div>
 *   &lt;script type="text/javascript">
 *     $('#map').simplicityNokiaMap();
 *   &lt;/script>
 *
 * @see Nokia Maps - JavaScript API <a href="http://api.maps.nokia.com/">documentation</a>.
 */
(function ($) {
  $.widget("ui.simplicityNokiaMap", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>map</dt>
     *   <dd>
     *     Optional map instance, if not provided one will be created. Defaults to <code>''</code>.
     *   </dd>
     *   <dt>mapOptions</dt>
     *   <dd>
     *     Options used when creating the map. Defaults to <code>''</code> which is expanded at
     *     runtime to
     *     <pre>
     *     {
     *       center: [0, 0],
     *       zoomLevel: 1
     *     }
     *     </pre>
     *     Can be either an <code>Object</code> or a <code>function</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicityNokiaMap.options
     */
    options : {
      map: '',
      mapOptions: ''
    },
    _create: function () {
      this._addClass('ui-simplicity-nokia-map');
      if (this.options.map !== '') {
        this._map = this.options.map;
      } else {
        this._initWhenAvailable();
      }
    },
    /**
     * Lazy initialization method used to create the map only when the necessary JavaScript
     * is available. Intended to be called from any of this widgets public methods that need to
     * access the this._map.
     *
     * @name $.ui.simplicityNokiaMap._initWhenAvailable
     * @function
     * @private
     */
    _initWhenAvailable: function () {
      var wasAvailable = 'undefined' !== typeof this._map;
      if (wasAvailable) {
        // Already available, do nothing
      } else if (this.options.map !== '') {
        this._map = this.options.map;
      } else if ('undefined' !== typeof nokia && 'undefined' !== typeof nokia.maps && 'undefined' !== typeof nokia.maps.map && 'undefined' !== typeof nokia.maps.map.Display) {
        var defaultMapOptions = {
          center: [0, 0],
          zoomLevel: 1
        };
        var mapOptions;
        if (this.options.mapOptions === '') {
          mapOptions = defaultMapOptions;
        } else if ($.isFunction(this.options.mapOptions)) {
          mapOptions = $.extend(defaultMapOptions, this.options.mapOptions.call(this));
        } else {
          mapOptions = $.extend(defaultMapOptions, this.options.mapOptions);
        }
        this._map = new nokia.maps.map.Display(this.element[0], mapOptions);
        this._trigger('create', {}, {
          map: this._map
        });
      }
      var isAvailable = 'undefined' !== typeof this._map;
      return isAvailable;
    },
    /**
     * Return the actual map object.
     *
     * @name $.ui.simplicityNokiaMap.map
     * @function
     */
    map: function () {
      this._initWhenAvailable();
      return this._map;
    },
    destroy: function () {
      delete this._map;
      $.ui.simplicityWidget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
