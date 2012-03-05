/**
 * @name $.ui.simplicityNokiaMapShapeCreator
 * @namespace A Nokia map.
 * <p>
 * An visible jquery ui widget which creates shapes that can be used in a discovery query. Whenever
 * the shapes change...
 *
 * @example
 *   &lt;div id="map" style="width: 300px; height: 300px;">&lt;/div>
 *   &lt;script type="text/javascript">
 *     $('#map').simplicityNokiaMapShapeCreator();
 *   &lt;/script>
 *
 * @see Nokia Maps JavaScript API V2 <a href="http://api.maps.nokia.com/">documentation</a>.
 */
(function ($) {
  var NokiaMapsImpl = function (ele, map, options) {
    this._map = map;
    this.markerOptions = options.markerOptions;
    this.lineStringOptions = options.lineStringOptions;
    this.polygonOptions = options.polygonOptions;
    this.circleOptions = options.circleOptions;
    this.draggableMarkers = options.draggableMarkers;
    this.options = options;
    this.mvcCoords = new nokia.maps.geo.Strip([]);
    this._markers = [];
    this._mapClickHandler = null;
    this.currentMapShape = null;
    this.element = ele;

    this.precision = 10000;
    $(ele).simplicityMapShapeCreator("mapImpl");
    this.zoomMapComponent = this._map.getComponentById("zoom.DoubleClick");
    var a = this.options.assets.vertexMarkerImage.anchor;
    this.vertexMarkerImage = {
        "icon": this.options.staticPath + this.options.assets.vertexMarkerImage.icon,
        "anchor": new nokia.maps.util.Point(a[0], a[1])
      };
    a = this.options.assets.firstVertexMarkerImage.anchor;
    this.firstVertexMarkerImage = {
        "icon": this.options.staticPath + this.options.assets.firstVertexMarkerImage.icon,
        "anchor": new nokia.maps.util.Point(a[0], a[1])
      };
    this.creatingMapCursor = 'crosshair';
    this.mapCursor = 'inherit';

    this.providerId = function () {
      return 'Nokia';
    };

    this.setLatLngPrecision = function (precision) {
      this.precision = precision * 10;
    };
    this.setMarkerStyle = function (idx, style) {
      if (idx < this._markers.length) {
        var marker = this._markers[idx].marker;
        if (style === 'vertex') {
          marker.set($.extend({zIndex: +150}, this.vertexMarkerImage));
        } else if (style === 'firstVertex') {
          marker.set($.extend({zIndex: +200}, this.firstVertexMarkerImage));
        }
      }
    };
    this.setRadius = function (radius, shapeType) {
      this.radius = radius;
      this.radiusMiles = radius * 1609.344;
      if (this.radius === "0" || shapeType === 'Polygon' || shapeType === 'LineString') {
        $.each(this._markers, $.proxy(function (idx, m) {
          if (m.radiusCircle) {
            this._map.objects.remove(m.radiusCircle);
          }
        }, this));
      } else {
        $.each(this._markers, $.proxy(function (idx, m) {
          if (m.radiusCircle) {
            m.radiusCircle.set($.extend({}, {"radius": this.radiusMiles}));
          } else {
            this._createRadiusCircle(m);
          }
          if (this._map.objects.indexOf(m.radiusCircle) === -1) {
            this._map.objects.add(m.radiusCircle);
          }
        }, this));
      }
    };
    this._createRadiusCircle = function (marker) {
      if (this.radiusMiles) {
        // creating a new Circle mutates the options object
        marker.radiusCircle = new nokia.maps.map.Circle(marker.marker.coordinate, this.radiusMiles, $.extend({}, this.options.circleOptions));
        this._map.objects.add(marker.radiusCircle);
      }
    };
    this.addRadius = function (idx) {
      if (idx < this._markers.length) {
        marker = this._markers[idx];
        this._createRadiusCircle(marker);
      }
    };
    this.addMarker = function (idx, latLng, createOptions, addToMap) {
      var marker;
      if ($.isFunction(this.options.addMarker)) {
        marker = this.options.addMarker(idx, latLng, createOptions, addToMap);
      } else {
        marker = new nokia.maps.map.Marker(
          latLng,
          $.extend(this.vertexMarkerImage, this.options.circleOptions)
        );
        marker.addListener('mouseenter', $.proxy(function (evt) {
          $(this.element).css({cursor: 'pointer'});
        }, this));
        marker.addListener('mouseout', $.proxy(function (evt) {
          $(this.element).css({cursor: this.mapCursor});
        }, this));
        this._markers.push({"marker": marker});
        if (createOptions.draggable) {
          marker.set({"draggable": true, "zIndex": +150});
        }
      }
      if ('undefined' === typeof addToMap || addToMap === true) {
        this.addToMap(marker);
      }
      return marker;
    };
    this.removeMarkers = function () {
      this.removeMarkerClickListener(0);
      $.each(this._markers, $.proxy(function (idx, o) {
        var marker = o.marker;
        // according to the docs, all async events are removed on destroy()
        if (o.radiusCircle) {
          this._map.objects.remove(o.radiusCircle);
        }
        this._map.objects.remove(marker);
      }, this));
      this._markers = [];
      this.coordsClear();
    };
    this.addLineString = function (addToMap) {
      var polyline;
      if ($.isFunction(this.options.addLineString)) {
        polyline = this.options.addLineString();
      } else {
        polyline = new nokia.maps.map.Polyline(this.mvcCoords, this.lineStringOptions);
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
        polygon = new nokia.maps.map.Polygon(this.mvcCoords, $.extend({}, this.options.polygonOptions));
      }
      if ('undefined' === typeof addToMap || addToMap === true) {
        this.addToMap(polygon);
      }
      this.currentMapShape = polygon;
      return polygon;
    };
    this.addToMap = function (object) {
      if (object !== null) {
        this._map.objects.add(object);
      }
    };
    this.removeFromMap = function (object) {
      if (object !== null) {
        this._map.objects.remove(object);
      }
    };
    this.draw = function (enable) {
      if (enable) {
        this.mapCursor = this.creatingMapCursor;
        if (this.zoomMapComponent !== null) {
          this._map.removeComponent(this.zoomMapComponent);
        }
      } else {
        this.mapCursor = 'inherit';
        if (this.zoomMapComponent !== null && this._map.getComponentById("zoom.DoubleClick") === null) {
          this._map.addComponent(this.zoomMapComponent);
        }
      }
      $(this.element).css({cursor: this.mapCursor});
    };
    this.removeShapeFromMap = function () {
      if (this.currentMapShape !== null) {
        this.removeFromMap(this.currentMapShape);
        this.currentMapShape = null;
      }
    };
    // Map Listeners
    this.addMapClickListener = function (handler, context) {
      if (this._mapClickHandler === null) {
        this._mapClickHandler = $.proxy(handler, context);
        this._map.addListener('click', this._mapClickHandler);
      }
    };
    this.removeMapClickListener = function () {
      if (this._mapClickHandler) {
        this._map.removeListener('click', this._mapClickHandler);
      }
      this._mapClickHandler = null;
    };
    // Markers
    this.getDragPosition = function (marker, evt) {
      return this.getLatLngFromEvent(evt);
    };
    this.getMarkerPosition = function (marker) {
      return marker.coordinate;
    };
    this.addMarkerClickListener = function (idx, handler, context) {
      if (idx < this._markers.length) {
        this._markers[idx].marker.addListener('click', $.proxy(handler, context));
      }
    };
    this.removeMarkerClickListener = function (idx) {
      // according to the docs, all async events are removed on destroy()
    };
    this.addMarkerMoveListener = function (idx, marker, handler, context) {
      if (idx < this._markers.length) {
        marker.addListener('drag', $.proxy(handler, context));
      }
    };
    this.removeMarkerMoveListeners = function () {
      // according to the docs, all async events are removed on destroy()
    };
    this.addMarkerDragEndListener = function (idx, marker, handler, context) {
      if (idx < this._markers.length) {
        marker.addListener('dragend', $.proxy(handler, context));
      }
    };
    this.removeMarkerDragEndListeners = function () {
      // according to the docs, all async events are removed on destroy()
    };
    this.getLatLngFromEvent = function (evt) {
      var latLng = this._map.pixelToGeo(evt.displayX, evt.displayY);
      return new nokia.maps.geo.Coordinate(this._trunc(latLng.latitude), this._trunc(latLng.longitude), 0, true);
    };
    this.normalizeLatLngToGeoJson = function (latLng) {
      return [this._trunc(latLng.longitude), this._trunc(latLng.latitude)];
    };
    this.makeLatLng = function (lat, lng) {
      // parameters must be numeric
      return new nokia.maps.geo.Coordinate(lat, lng);
    };
    //
    this.normalizeCoordsToGeoJson = function () {
      var result = [];
      var i = 0;
      //  array of latitude, longitude, altitude...
      var coords = this.mvcCoords.asArray();
      var len = coords.length;
      for (i = 0; i < len; i = i + 3) {
        result.push([this._trunc(coords[i + 1]), this._trunc(coords[i])]);
      }
      return result;
    };
    this._trunc = function (v) {
      return Math.round(v * this.precision) / this.precision;
    };
    this.updateBounds = function (bounds) {
      $.each(this._markers, $.proxy(function (idx, m) {
        var bb = m.marker.getBoundingBox(this._map);
        bounds.push(bb.bottomRight);
        bounds.push(bb.topLeft);
        if (m.radiusCircle) {
          bb = m.radiusCircle.getBoundingBox(this._map);
          bounds.push(bb.bottomRight);
          bounds.push(bb.topLeft);
        }
      }, this));
    };
    this.setMapCenterFromMarker = function (marker) {
      if (marker) {
        this._map.setCenter(marker.coordinate, 'default');
      }
    };
    this._coordsObserver = function (strip, idx, inserted, removed) {
      if (inserted === 0) {
      } else {
        if (this.currentMapShape !== null) {
          this.currentMapShape.path.set(idx, strip.get(idx));
        }
        if (idx < this._markers.length) {
          if (this._markers[idx].radiusCircle) {
            this._markers[idx].radiusCircle.set("center", strip.get(idx));
          }
        }
      }
    };
    this.getCoordsArray = function () {
      return this.mvcCoords;
    };
    this.createCoordsArray = function () {
      this.mvcCoords = new nokia.maps.geo.Strip([]);
      this.mvcCoords.addObserver(this._coordsObserver, this);
      return this.mvcCoords;
    };
    this.coordsLength = function () {
      return this.mvcCoords.getLength();
    };
    this.coordsPush = function (latLng) {
      var idx = this.mvcCoords.getLength();
      this.mvcCoords.add(latLng);
      return idx;
    };
    this.coordsGet = function (idx) {
      return this.mvcCoords.get(idx);
    };
    this.coordsSetAt = function (idx, latLng) {
      this.mvcCoords.set(idx, latLng);
    };
    this.coordsClear = function () {
      this.mvcCoords.removeObserver(this._coordsObserver, this);
      this.mvcCoords.destroy();
      this.createCoordsArray();
    };
  };
  $.widget("ui.simplicityNokiaMapShapeCreator", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>map</dt>
     *   <dd>
     *     Optional map instance, if not provided one will be looked up. Defaults to <code>''</code>.
     *   </dd>
     *   <dt>mapMoveEvents</dt>
     *   <dd>
     *     Provides an override of which vendor specific map events are used to determine
     *     when the position of the map changes. Expects a comma separated list of event names.
     *     Defaults to <code>'idle'</code>.
     * </dl>
     * @name $.ui.simplicityNokiaMapShapeCreator.options
     */
    options: {
      map: '',
      staticPath: '../',
      updateBounds: true,
      markerOptions: '',
      lineStringOptions: {width: 2, lineJoin: "round"},
      polygonOptions: {brush: {color: '#0066cc32'}, width: 2},
      circleOptions: {brush: {color: '#0066cc32'}, width: 0},
      addMarker: '',
      addLineString: '',
      addPolygon: ''
    },
    _create: function () {
      this._map = this.options.map !== '' ? this.options.map : this.element.simplicityNokiaMap('map');
      this.element.simplicityMapShapeCreator(this.element, this.options);
      var assets = this.element.simplicityMapShapeCreator("option", "assets");
      this.mapImpl = new NokiaMapsImpl(this.element, this._map, $.extend(this.options, {assets: assets}));
      this.element.simplicityMapShapeCreator("map", this._map);
      this.element.simplicityMapShapeCreator("mapImpl", this.mapImpl);
      this._addClass('ui-simplicity-nokia-map-shape-creator');
      if (this.options.updateBounds) {
        this._bind('simplicitynokiamapboundscoordinatorcalculatebounds', this._calcBoundsHandler);
      }
    },
    _calcBoundsHandler: function (evt, ui) {
      var bounds = ui.coordinates;
      if ('undefined' !== typeof bounds) {
        this.mapImpl.updateBounds(bounds);
      }
    }
  });
}(jQuery));
