/**
 * @name $.ui.simplicityGoogleShapeCreator
 * @namespace A Google map.
 * <p>
 * An visible jquery ui widget which creates shapes that can be used in a discovery query. Whenever
 * the shapes change...
 *
 * @example
 *   &lt;div id="map" style="width: 300px; height: 300px;">&lt;/div>
 *   &lt;script type="text/javascript">
 *     $('#map').simplicityGoogleShapeCreator();
 *   &lt;/script>
 *
 * @see Google Maps JavaScript API V3 <a href="http://code.google.com/apis/maps/documentation/javascript/">documentation</a>.
 */
// TODO Create docs and copy to Nokia
(function ($) {
  var GoogleMapsImpl = function (map, options) {
    this._map = map;
    this.markerOptions = options.markerOptions;
    this.lineStringOptions = options.lineStringOptions;
    this.polygonOptions = options.polygonOptions;
    this.circleOptions = options.circleOptions;
    this.options = options;
    this.mvcCoords = new google.maps.MVCArray();
    this._markers = [];
    this._mapClickListener = null;
    this.currentMapShape = null;
    this._firstMarkerListener = null;

    this.precision = 10000;

    var a = this.options.assets.vertexMarkerImage.anchor;
    var s = this.options.assets.vertexMarkerImage.size;
    this.vertexMarkerImage = new google.maps.MarkerImage(
        this.options.staticPath + this.options.assets.vertexMarkerImage.icon,
        new google.maps.Size(s[0], s[1]),
        new google.maps.Size(0, 0),
        new google.maps.Point(a[0], a[1])
    );
    a = this.options.assets.firstVertexMarkerImage.anchor;
    s = this.options.assets.firstVertexMarkerImage.size;
    this.firstVertexMarkerImage = new google.maps.MarkerImage(
        this.options.staticPath + this.options.assets.firstVertexMarkerImage.icon,
        new google.maps.Size(s[0], s[1]),
        new google.maps.Size(0, 0),
        new google.maps.Point(a[0], a[1])
    );
    this.mapCursor = 'crosshair';

    this.providerId = function () {
      return 'Google';
    };

    this.setLatLngPrecision = function (precision) {
      this.precision = precision * 10;
    };
    this.setMarkerStyle = function (idx, style) {
      if (idx < this._markers.length) {
        var marker = this._markers[idx].marker;
        if (style === 'vertex') {
          marker.setOptions({
            "icon": this.vertexMarkerImage,
            "zIndex": +150
          });
        } else if (style === 'firstVertex') {
          marker.setOptions({
            "icon": this.firstVertexMarkerImage,
            "zIndex": +200
          });
        }
      }
    };
    this.setRadius = function (radius, shapeType) {
      this.radius = radius;
      this.radiusMiles = radius * 1609.344;
      if (radius === "0" || shapeType === 'Polygon' || shapeType === 'LineString') {
        $.each(this._markers, $.proxy(function (idx, m) {
          if (m.radiusCircle) {
            m.radiusCircle.setMap(null);
          }
        }, this));
      } else {
        $.each(this._markers, $.proxy(function (idx, m) {
          if (m.radiusCircle) {
            m.radiusCircle.setMap(null);
          }
          this._createRadiusCircle(m);
        }, this));
      }
    };
    this._createRadiusCircle = function (marker) {
      if (this.radiusMiles) {
        marker.radiusCircle = new google.maps.Circle(
          $.extend(this.options.circleOptions,
          {
            center: marker.marker.getPosition(),
            map: this._map,
            radius: this.radiusMiles
          }));
      }
    };
    this.addRadius = function (idx) {
      if (idx > -1 && idx < this._markers.length) {
        marker = this._markers[idx];
        this._createRadiusCircle(marker);
      }
    };
    this.addMarker = function (idx, latLng, createOptions, addToMap) {
      var marker;
      if ($.isFunction(this.options.addMarker)) {
        marker = this.options.addMarker(idx, latLng, createOptions, addToMap);
      } else {
        var markerOpts = $.extend(this.markerOptions, {
          position: latLng,
          icon: this.vertexMarkerImage
        });
        marker = new google.maps.Marker(markerOpts);
      }
      this._markers.push({"marker": marker, "moveListener": null, "dragEndListener": null});
      if (createOptions.draggable) {
        marker.setOptions({draggable: true, zIndex: +150});
      }
      if ('undefined' === typeof addToMap || addToMap === true) {
        this.addToMap(marker);
      }
      return marker;
    };
    this.addLineString = function (addToMap) {
      var polyline;
      if ($.isFunction(this.options.addLineString)) {
        polyline = this.options.addLineString();
      } else {
        var lineOptions = $.extend(this.lineStringOptions, {path: this.mvcCoords});
        polyline = new google.maps.Polyline(lineOptions);
      }
      if ('undefined' === typeof addToMap || addToMap === true) {
        this.addToMap(polyline);
      }
      this.currentMapShape = polyline;
      return polyline;
    };
    this.addPolygon = function (addToMap) {
      var polygon;
      if ($.isFunction(this.options.addPolygon)) {
        polygon = this.options.addPolygon();
      } else {
        var polyOptions = $.extend(this.polygonOptions, {paths: this.mvcCoords});
        polygon = new google.maps.Polygon(polyOptions);
      }
      if ('undefined' === typeof addToMap || addToMap === true) {
        this.addToMap(polygon);
      }
      this.currentMapShape = polygon;
      return polygon;
    };
    this.addToMap = function (object) {
      if (object !== null) {
        object.setMap(this._map);
      }
    };
    this.removeFromMap = function (object) {
      if (object !== null) {
        object.setMap(null);
      }
    };
    this.draw = function (enable) {
      if (enable) {
        this._map.setOptions({
          'draggableCursor': this.mapCursor,
          'draggingCursor': 'pointer',
          'disableDoubleClickZoom': true
        });
      } else {
        this._map.setOptions({
          'draggableCursor': '',
          'draggingCursor': '',
          'disableDoubleClickZoom': false
        });
      }
    };
    this.removeShapeFromMap = function () {
      if (this.currentMapShape !== null) {
        this.currentMapShape.setMap(null);
        this.currentMapShape = null;
      }
    };
    // Map Listeners
    this.addMapClickListener = function (handler, context) {
      if (this._mapClickListener === null) {
        this._mapClickListener = google.maps.event.addListener(this._map, 'click', $.proxy(handler, context));
      }
    };
    this.removeMapClickListener = function () {
      if (this._mapClickListener !== null) {
        google.maps.event.removeListener(this._mapClickListener);
        this._mapClickListener = null;
      }
    };
    // Markers
    this.getDragPosition = function (marker, evt) {
      return this.getMarkerPosition(marker);
    };
    this.getMarkerPosition = function (marker) {
      var position = marker.getPosition();
      return new google.maps.LatLng(this._trunc(position.lat()), this._trunc(position.lng()));
    };
    this.removeMarkers = function () {
      this.removeMarkerClickListener(0);
      this.removeMarkerMoveListeners();
      this.removeMarkerDragEndListeners();
      $.each(this._markers, function (idx, o) {
        var marker = o.marker;
        marker.setMap(null);
        if (o.radiusCircle) {
          o.radiusCircle.setMap(null);
        }
      });
      this._markers = [];
      this.coordsClear();
    };
    this.addMarkerClickListener = function (idx, handler, context) {
      if (idx < this._markers.length) {
        this._firstMarkerListener = google.maps.event.addListener(this._markers[idx].marker, 'click', $.proxy(handler, context));
      }
    };
    this.removeMarkerClickListener = function (idx) {
      if (this._firstMarkerListener !== null) {
        google.maps.event.removeListener(this._firstMarkerListener);
        this._firstMarkerListener = null;
      }
    };
    this.addMarkerMoveListener = function (idx, marker, handler, context) {
      var result = null;
      if (idx < this._markers.length) {
        result =  google.maps.event.addListener(marker, 'position_changed', $.proxy(handler, context));
        this._markers[idx].moveListener = result;
      }
      return result;
    };
    this.removeMarkerMoveListeners = function () {
      $.each(this._markers, function (idx, o) {
        var listener = o.moveListener;
        if (listener !== null) {
          google.maps.event.removeListener(listener);
          o.moveListener = null;
        }
      });
    };
    this.addMarkerDragEndListener = function (idx, marker, handler, context) {
      if (idx < this._markers.length) {
        this._markers[idx].dragEndListener =  google.maps.event.addListener(marker, 'dragend', $.proxy(handler, context));
      }
    };
    this.removeMarkerDragEndListeners = function () {
      $.each(this._markers, function (idx, o) {
        var listener = o.dragEndListener;
        if (listener !== null) {
          google.maps.event.removeListener(listener);
          o.moveListener = null;
        }
      });
    };
    this.getLatLngFromEvent = function (evt) {
      return new google.maps.LatLng(this._trunc(evt.latLng.lat()), this._trunc(evt.latLng.lng()));
    };
    this.makeLatLng = function (lat, lng) {
      return new google.maps.LatLng(lat, lng);
    };
    //
    this.normalizeCoordsToGeoJson = function () {
      var result = [];
      this.mvcCoords.forEach($.proxy(function (latLng, idx) {
        result.push([this._trunc(latLng.lng()), this._trunc(latLng.lat())]);
      }, this));
      return result;
    };
    this.normalizeLatLngToGeoJson = function (latLng) {
      return [this._trunc(latLng.lng()), this._trunc(latLng.lat())];
    };
    this._trunc = function (v) {
      return Math.round(v * this.precision) / this.precision;
    };
    this.updateBounds = function (bounds) {
      $.each(this._markers, $.proxy(function (idx, m) {
        bounds.extend(m.marker.getPosition());
        if (m.radiusCircle && m.radiusCircle.getMap() !== null) {
          bounds.union(m.radiusCircle.getBounds());
        }
      }, this));
    };
    this.setMapCenterFromMarker = function (marker) {
      if (marker) {
        this._map.setCenter(marker.getPosition());
      }
    };
    this.coordsObserver = function () {
      // Google maps does not need a coords array observer as MVCArray maanges the events
    };
    this.getCoordsArray = function () {
      return this.mvcCoords;
    };
    this.createCoordsArray = function () {
      this.mvcCoords = new google.maps.MVCArray();
      return this.mvcCoords;
    };
    this.coordsLength = function () {
      return this.mvcCoords.getLength();
    };
    this.coordsPush = function (latLng) {
      var idx = this.mvcCoords.getLength();
      this.mvcCoords.push(latLng);
      return idx;
    };
    this.coordsGet = function (idx) {
      return this.mvcCoords.getAt(idx);
    };
    this.coordsSetAt = function (idx, latLng) {
      this.mvcCoords.setAt(idx, latLng);
      if (this._markers[idx].radiusCircle) {
        this._markers[idx].radiusCircle.setCenter(latLng);
      }
    };
    this.coordsClear = function () {
      this.mvcCoords.clear();
    };
  };
  $.widget("ui.simplicityGoogleShapeCreator", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>map</dt>
     *   <dd>
     *     Optional map instance, if not provided one will be looked up. Defaults to <code>''</code>.
     *   </dd>
     *   <dt>updateBounds</dt>
     *   <dd>
     *     Set this to <code>true</code> to cause the map bounds to respond to
     *     simplicityGoogleMapBoundsCoordinator a tooltip to appear above the slider handle.
     *     Defaults to <code>false</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicityGoogleShapeCreator.options
     */
    options: {
      map: '',
      staticPath: '../',
      updateBounds: true,
      markerOptions: '',
      lineStringOptions: {strokeWeight: 2},
      polygonOptions: {strokeWeight: 2, fillOpacity: 0.20},
      circleOptions: {strokeWeight: 0, fillOpacity: 0.20},
      addMarker: '',
      addLineString: '',
      addPolygon: ''
    },
    _create: function () {
      this._map = this.options.map !== '' ? this.options.map : this.element.simplicityGoogleMap('map');
      this.element.simplicityMapShapeCreator(this.element, this.options);
      var assets = this.element.simplicityMapShapeCreator("option", "assets");
      this.mapImpl = new GoogleMapsImpl(this._map, $.extend(this.options, {assets: assets}));
      this.element.simplicityMapShapeCreator("map", this._map);
      this.element.simplicityMapShapeCreator("mapImpl", this.mapImpl);
      this._addClass('ui-simplicity-google-shape-creator');
      if (this.options.updateBounds) {
        this._bind('simplicitygooglemapboundscoordinatorcalculatebounds', this._calcBoundsHandler);
      }
    },
    _calcBoundsHandler: function (evt, ui) {
      var bounds = ui.bounds;
      if ('undefined' !== typeof bounds) {
        this.mapImpl.updateBounds(bounds);
      }
    }
  });
}(jQuery));
