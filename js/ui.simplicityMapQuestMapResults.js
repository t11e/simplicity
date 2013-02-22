/**
 * @name $.ui.simplicityMapQuestMapResults
 * @namespace A MapQuest map
 * <p>
 * Widget that listens for <code>simplicitySearchResponse</code> events which it uses to add markers to the map for the search results.
 *
 * @example
 *   &lt;div id="map" style="width: 300px; height: 300px;">&lt;/div>
 *   &lt;script type="text/javascript">
 *     $('#map').simplicityMapQuestMapResults();
 *   &lt;/script>
 *
 * @see MapQuest JavaScript SDK v6 <a href="http://platform.beta.mapquest.com/sdk/js/v6.0.0/">documentation</a>.
 */
(function ($) {
  $.widget("ui.simplicityMapQuestMapResults", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>searchElement</dt>
     *   <dd>
     *     The simplicityDiscoverySearch widget that this widget binds it's events to. Defaults to <code>'body'</code>.
     *   </dd>
     *   <dt>latitudeField</dt>
     *   <dd>
     *     Field to find the latitude of the result item in the <code>simplicityResultSet</code>
     *     item properties. Defaults to <code>'latitude'</code>.
     *   </dd>
     *   <dt>longitudeField</dt>
     *   <dd>
     *     Field to find the longitude of the result item in the <code>simplicityResultSet</code>
     *     item properties. Defaults to <code>'longitude'</code>.
     *   </dd>
     *   <dt>map</dt>
     *   <dd>
     *     Optional map instance, if not provided one will be created. Defaults to <code>''</code>.
     *   </dd>
     *   <dt>updateBounds<dt>
     *   <dd>
     *     Whether or not the map bounds should be updated to include the result locations. Defaults to true.
     *   </dd>
     * </dl>
     * @name $.ui.simplicityMapQuestMapResults.options
     */
    options : {
      searchElement: 'body',
      latitudeField: 'latitude',
      longitudeField: 'longitude',
      updateBounds: true,
      map: ''
    },
    _create: function () {
      this._addClass('ui-simplicity-mapquest-map-results');
      this._map = this.options.map !== '' ? this.options.map : this.element.simplicityMapQuestMap('map');
      this._markers = [];
      this
        ._bind(this.options.searchElement, 'simplicitySearchResponse', this._resultSetHandler)
        ._bind('simplicitymapquestmapboundscoordinatorcalculatebounds', this._calcBoundsHandler);
    },
    /**
     * Return the actual map object.
     *
     * @name $.ui.simplicityMapQuestMapResults.map
     * @function
     */
    map: function () {
      return this._map;
    },
    /**
     * Makes the widget re-handle the last <code>simplicityResultSet</code> event to reapply
     * any map markers.
     *
     * @name $.ui.simplicityMapQuestMapResults.refreshMap
     * @function
     */
    refreshMap: function () {
      this.removeMarkers();
      this.addMarkers();
    },
    /**
     * Event handler for the <code>simplicitySearchResponse</code> event. Extracts the coordinates
     * of each result item by using the property fields defined by the
     * <code>latitudeField</code> and <code>longitudeField</code> options of this widget and
     * places a marker on the map for each valid coordinate. The map is then reset to best
     * display the current set of markers.
     *
     * @name $.ui.simplicityMapQuestMapResults._resultSetHandler
     * @function
     * @private
     */
    _resultSetHandler: function (evt, searchResponse) {
      this.removeMarkers();
      this.addMarkers(searchResponse);
    },
    _calcBoundsHandler: function (evt, ui) {
      if ($.isArray(ui.locations) && this.options.updateBounds) {
        $.each(this._markers, function (idx, marker) {
          ui.locations.push(marker.latLng);
        });
      }
    },
    /**
     * Removes any markers that were added to the map by <code>addMarkers</code>.
     *
     * @name $.ui.simplicityMapQuestMapResults.removeMarkers
     * @function
     * @private
     */
    removeMarkers: function () {
      $.each(this._markers, $.proxy(function (idx, marker) {
        var eventData = {
          map: this._map,
          marker: marker
        };
        this._trigger('removemarker', {}, eventData);
        marker = eventData.marker;
        if ('undefined' !== typeof marker) {
          this._map.removeShape(marker);
        }
      }, this));
      this._markers.length = 0;
    },
    /**
     * Adds any markers that can be extracted from the given <code>searchResponse</code>.
     *
     * @name $.ui.simplicityMapQuestMapResults.addMarkers
     * @function
     * @private
     */
    addMarkers: function (searchResponse) {
      if ('undefined' === typeof searchResponse) {
        searchResponse = $(this.options.searchElement).simplicityDiscoverySearch('searchResponse');
      }
      $.fn.simplicityDiscoverySearchItemEnumerator(searchResponse, $.proxy(function (idx, row) {
        var properties = row.properties;
        if ('undefined' !== typeof properties) {
          var latitude = properties[this.options.latitudeField];
          var longitude = properties[this.options.longitudeField];
          if ('undefined' !== typeof latitude && 'undefined' !== typeof longitude) {
            latitude = Number(latitude);
            longitude = Number(longitude);
            var marker = new MQA.Poi(new MQA.LatLng(latitude, longitude));
            var eventData = {
              row: row,
              map: this._map,
              marker: marker
            };
            this._trigger('marker', {}, eventData);
            marker = eventData.marker;
            if ('undefined' !== typeof marker) {
              this._markers.push(marker);
              this._map.addShape(marker);
            }
          }
        }
      }, this));
    },
    destroy: function () {
      $.each(this._boundsChangeListeners, $.proxy(function (eventName, listener) {
        MQA.EventManager.removeListener(this._map, eventName, listener);
      }, this));
      this._boundsChangeListeners = {};
      $.ui.simplicityWidget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
