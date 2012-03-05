/**
 * @name $.ui.simplicityMapShapeCreator
 * @namespace A map shape creator for use in Discovery searches.
 * <p>
 * This widget is generally only called through one of its implementations that
 * are specific to a map provider.
 *
 * Current simplcityMapShapeCreator implementations:
 * <ul><li>simplicityGoogleShapeCreator</li>
 * <li>simplicityNokiaMapShapeCreator</li></ul>
 *
 * <p>A widget which creates a single shape on a map. Current shapes are Point(s), Lines
 * and Polygons. Whenever the shapes change, the underlying simplicityInput element
 * will be updated.</p>
 *
 * <p>The widget supports exactDistance values by showing circles around any drawn
 * point, as long as the point is not part of a line or a polygon.</p>
 *
 * <p>Requires an instance of simplicity&lt;mapprovider&gt;ShapeCreator implementation.
 * When used in conjunction with simplicityMapShapeCreatorUi, a complete visible
 * shape creator interface is made available.</p>
 *
 * <p>Triggers a simplicitymapshapecreatorshapechanged event which other components can use to
 * add additional functionality.</p>
 *
 * The map is formatted into geoJSON (HREF) as follows:
 * <pre>
 * {
 *   "placemarks": {
 *     "type": "Polygon",
 *     "coordinates": [[[lng1,lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1]]]
 *   },
 *   "properties": {
 *     "radius": 1.5
 *   }
 * }
 * </pre>
 *
 * <p>The Discovery Search Engine criterion using the geoJSON format would look
 * like this:</p>
 * <pre>
 * {
 *    "dimension": "location",
 *    "placemarks": {
 *      "type": "Polygon",
 *      "coordinates": [[[lng1,lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1]]]
 *    },
 *    "exactDistance": 1.5
 * }
 * </pre>
// TODO Get icon Assets in media.yml and properly place in folder structure
// TODO Circle should be draggable
// TODO The look of the help button should be improved
 */
(function ($) {
  $.widget("ui.simplicityMapShapeCreator", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>map</dt>
     *   <dd>
     *     Required map instance.
     *   </dd>
     *   <dt>input</dt>
     *   <dd>
     *     A single <code>input</code> to associate the shape data with.
     *   </dd>
     *   <dt>stateElement</dt>
     *   <dd>
     *     The location of the simplicityState widget. Defaults to <code>'body'</code>.
     *   </dd>
     *   <dt>draggableMarkers</dt>
     *   <dd>
     *     Set this to <code>true</code> to allow created markers (vertices)
     *     to be dragged to new positions. Not all map providers may support
     *     draggable markers.
     *     Defaults to <code>true</code>.
     *   </dd>
     *   <dt>stateTriggerShapes</dt>
     *   <dd>
     *     Set this to an array of shape types that will trigger a state change. Valid values
     *     are <code>Point</code>, <code>MultiPoint</code>, <code>LineString</code>
     *     and <code>Polygon</code>.
     *     Defaults to <code>['Point', 'Polygon']</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicityMapShapeCreator.options
     */
    options: {
      map: '',
      inputName: 'placemark',
      stateElement: 'body',
      draggableMarkers: true,
      stateTriggerShapes: ['Polygon'],
      assets: {
        vertexMarkerImage: {
          icon: "css/simplicity/shapecreator/vertex_alpha_17x17.png",
          size: [17, 17],
          anchor: [9, 9]
        },
        firstVertexMarkerImage: {
          icon: "css/simplicity/shapecreator/first_marker_alpha_29x29.png",
          size: [29, 29],
          anchor: [15, 15]
        }
      }
    },
    _create: function () {
      this._map = this.options.map;
      this.points = [];
      this.makeLineString = true;
      this.radius = 1;
      this._geoJSON = this._newGeoJSON();
      this.editing = false;

      this.input = $('<input/>')
        .change($.proxy(function (evt, ui) {
          state = $(this.options.stateElement).simplicityState('state');
          var name = this.options.inputName;
          if (this.input.val().trim().length === 0) {
            delete state[name];
          } else {
            state[name] = this.input.val();
          }
          try {
            this._ignoreChangeEvent = true;
            $(this.options.stateElement).simplicityState('state', state);
          } finally {
            this._ignoreChangeEvent = false;
          }
        }, this));

      this
      ._addClass('ui-simplicity-map-shape-creator')
        ._bind(this.options.stateElement, 'simplicityStateChange', this._stateChangeHandler);
    },
    /**
     * Set or Return the actual map object.
     *
     * @name $.ui.simplicityMapShapeCreator.map
     * @function
     */
    map: function (map) {
      if (arguments.length === 0) {
        return this._map;
      } else {
        this._map = map;
      }
    },
    /**
     * Set or Return the actual map impl object.
     *
     * @name $.ui.simplicityMapShapeCreator.mapImpl
     * @function
     */
    mapImpl: function (mapImpl) {
      if (arguments.length === 0) {
        return this._mapImpl;
      } else {
        this._mapImpl = mapImpl;
        this.mvcCoords = this._mapImpl.createCoordsArray();
      }
    },
    /**
     * Return the actual geoJSON object.
     *
     * @name $.ui.simplicityMapShapeCreator.geoJSON
     * @function
     */
    geoJSON: function () {
      return this._geoJSON;
    },
    /**
     * Used to place a geocoded centroid -- thus the change needs to be forced
     *
     */
    newMarkerAt: function (lat, lng) {
      var latLng = this._mapImpl.makeLatLng(lat, lng);
      var marker = this._newPoint(latLng);
      if (marker) {
        if (this.points.length === 1) {
          this._mapImpl.addMarkerClickListener(0, this._firstMarkerClickHandler, this);
        }
        this.changeHandler(true);
      }
      return marker;
    },
    /**
     * Changes the <code>exactDistance</code> value and displays radius circles
     * around unlinked points. Triggers a state change.
     *
     * @name $.ui.simplicityMapShapeCreator.draw
     * @function
     * @param toggle determines whether to enable shape drawing or not.
     *
     */
    draw: function (startDraw) {
      if (startDraw) {
        this.editing = true;
        this._mapImpl.addMapClickListener(this._mapClickHandler, this);
        if (this._geoJSON.placemarks.type === 'LineString') {
          this._mapImpl.addMarkerClickListener(0, this._firstMarkerClickHandler, this);
        }
        if (this.points.length >= 3) {
          this._setFirstPointUI();
        }
        if (this._geoJSON.placemarks.type !== 'Polygon') {
          this._mapImpl.draw(true);
        }
      } else {
        this.editing = false;
        this._clearFirstPointUI();
        this._mapImpl.removeMapClickListener(this._mapClickHandler, this);
        this._mapImpl.removeMarkerClickListener(0);
        this._mapImpl.draw(false);
      }
    },
    /**
     * Changes the <code>exactDistance</code> value and displays radius circles
     * around unlinked points. Triggers a state change.
     *
     * @name $.ui.simplicityMapShapeCreator.setDistance
     * @function
     * @param radius The radius value to use.
     *
     */
    setDistance: function (radius) {
      this.radius = radius;
      this._mapImpl.setRadius(radius, this._geoJSON.placemarks.type);
      this._geoJSON.properties.radius = this.radius;
      this.changeHandler();
    },
    setRadius: function (radius) {
      this._mapImpl.setRadius(radius);
    },
    /**
     * Displays the created points linked by lines or as individual points.
     *
     * @name $.ui.simplicityMapShapeCreator.connect
     * @function
     * @param value The new state where <code>true</code> links the points with
     * lines and <code>false</code> shows unlinked points.
     *
     * Triggers a state change
     */
    connect: function (connect) {
      this.makeLineString = connect;
      if (this.makeLineString) {
        this._createLineString();
        this._mapImpl.addMarkerClickListener(0, this._firstMarkerClickHandler, this);
        if (this.points.length >= 3) {
          this._setFirstPointUI();
        }
      } else { // Disconnect
        this._removeMapShape();
        this._clearFirstPointUI();
        if (this._geoJSON.placemarks.type === 'Polygon') {
          // Convert LinearRing to MultiPoint coords
          this._geoJSON.placemarks.coordinates = this._geoJSON.placemarks.coordinates[0].slice(0, -1);
        }
        this._geoJSON.placemarks.type = (this.points.length === 1) ? 'Point' : 'MultiPoint';
        this._geoJSON.properties.radius = this.radius;
      }
      this._mapImpl.draw(true);
      this._mapImpl.setRadius(this.radius, this._geoJSON.placemarks.type);
      this._geoJSON.radius.exactDistance = this.radius;
      this.changeHandler();
    },
    /**
     * Handler for change events. When the underlying shape is changed this
     * handler updates the state of the associated simplicityState widget
     * with this data.
     *
     * <p>Triggers a simplicitymapshapecreatorshapechanged event. Handlers for that event receive a ui
     * object with a geoJSON member.</p>
     *
     * @name $.ui.simplicityMapShapeCreator.changeHandler
     * @function
     * @param force determines whether to force the change regardless of the type of shape in play.
     */
    changeHandler: function (force) {
      var coords = this._mapImpl.normalizeCoordsToGeoJson();
      if (this.options.debug) {
        console.log('simplicityMapShapeCreator: Handling shape change event for', this.element, 'with coords', coords);
      }
      this._triggerShapeChange(this._geoJSON);
      this.input.val(JSON.stringify(this._geoJSON));
      if (this._geoJSON.placemarks.coordinates.length > 0) {
        if (!this.editing ||
            force === true ||
            $.inArray(this._geoJSON.placemarks.type, this.options.stateTriggerShapes) > -1) {
          this.input.change();
        }
      } else {
        this.input.val('');
        this.input.change();
      }
    },
    /**
     * Clears any map drawing but does not affect state.
     *
     * @name $.ui.simplicityMapShapeCreator.clear
     * @function
     */
    clear: function () {
      this._removeMapShape();
      this._pointsClear();
      this._geoJSON = this._newGeoJSON();
    },
    /**
     * Resets the shape to an empty state by altering the current state and 
     * optionally triggering a state change.
     *
     * @name $.ui.simplicityMapShapeCreator.reset
     * @function
     */
    reset: function () {
      this.clear();
      this.changeHandler();
    },
    // END Public UI Methods
    _newGeoJSON: function () {
      return {
          placemarks: {
            type: 'Point',
            coordinates: []
          },
          properties: {
            radius: this.radius
          }
        };
    },
    /**
     * Handler for simplicityStateChange events. When the associated
     * simplicityState widget gets a new state this handler updates the
     * underlying shape to reflect the new state.
     *
     * @name $.ui.simplicityMapShapeCreator._stateChangeHandler
     * @function
     * @private
     */
    _stateChangeHandler: function (evt, state) {
      if (this.options.debug) {
        console.log('simplicityMapShapeCreator: Handling simplicityStateChange event for', this.element, 'with state', state);
      }
      if (!this._ignoreChangeEvent) {
        if ('undefined' !== typeof state[this.options.inputName]) {
          var valid = false;
          geoJSON = JSON.parse(state[this.options.inputName]);
          if ('undefined' !== typeof geoJSON.placemarks) {
            if ('undefined' !== typeof geoJSON.placemarks.type) {
              if ('undefined' !== typeof geoJSON.placemarks.coordinates) {
                if (geoJSON.placemarks.coordinates.length > 0) {
                  valid = true;
                }
              }
            }
          }
          if (valid) {
            this._geoJSONToMap(geoJSON);
            this._geoJSON = geoJSON;
            this._triggerShapeChange(this._geoJSON);
            this.input.val(JSON.stringify(this._geoJSON));
          } else {
            this._geoJSON = this._newGeoJSON();
          }
        }
      }
      if (this.options.debug) {
        console.log('simplicityMapShapeCreator: Handled simplicityStateChange event for', this.element, 'with state', state);
      }
    },
    _triggerShapeChange: function (geoJSON) {
      var ui = '';
      if (geoJSON) {
        ui = {
          geoJSON: geoJSON
        };
      }
      this._trigger('shapeChange', {}, ui);
    },
    _setFirstPointUI: function () {
      if (this._geoJSON.placemarks.type === 'Polygon') {
        this._mapImpl.setMarkerStyle(0, 'vertex');
      } else if (this._geoJSON.placemarks.type === 'LineString') {
        this._mapImpl.setMarkerStyle(0, 'firstVertex');
      } else {
        this._mapImpl.setMarkerStyle(0, 'vertex');
      }
    },
    _clearFirstPointUI: function () {
      if (this.points.length > 1) {
        this._mapImpl.setMarkerStyle(0, 'vertex');
      }
    },
    _mapClickHandler: function (evt) {
      var latLng = this._mapImpl.getLatLngFromEvent(evt);
      if (this._newPoint(latLng)) {
        this.changeHandler();
      }
    },
    _firstMarkerClickHandler: function (evt) {
      if (this._geoJSON.placemarks.type === 'LineString') {
        this._createPolygon();
        this._setFirstPointUI();
        this._mapImpl.draw(false);
        this.changeHandler();
      }
    },
    _markerMoveHandler: function (idx, marker) {
      return function (evt) {
        var latLng = this._mapImpl.getDragPosition(marker, evt);
        this._mapImpl.coordsSetAt(idx, latLng);
      };
    },
    _markerDragEndHandler: function (idx, marker) {
      return function (evt) {
        var coords;
        var latLng = this._mapImpl.getMarkerPosition(marker);
        this._mapImpl.coordsSetAt(idx, latLng);
        var type = this._geoJSON.placemarks.type;
        var geoJSONLatLng = this._mapImpl.normalizeLatLngToGeoJson(latLng);
        if (type === 'Point') {
          this._geoJSON.placemarks.coordinates = geoJSONLatLng;
        } else if (type === 'Polygon') {
          coords = this._geoJSON.placemarks.coordinates[0];
          if (idx < coords.length) {
            coords[idx] = geoJSONLatLng;
            if (idx === 0) { // LinearRing!
              coords[coords.length - 1] = geoJSONLatLng;
            }
          }
        } else if (type === 'LineString' || type === 'MultiPoint') {
          coords = this._geoJSON.placemarks.coordinates;
          if (idx < coords.length) {
            coords[idx] = geoJSONLatLng;
          }
        }
        this.changeHandler();
      };
    },
    _newPoint: function (latLng) {
      var marker = null;
      if (this._geoJSON.placemarks.type !== 'Polygon') {
        var idx = this.points.length;
        marker = this._newMarkerHandler(latLng, idx);
        this.points.push(marker);
        if (this.points.length === 1) {
          this._mapImpl.addMarkerClickListener(0, this._firstMarkerClickHandler, this);
        } else if (this.points.length === 2) {
          if (this.makeLineString) {
            this._createLineString();
          }
        } else if (this.points.length === 3) {
          this._setFirstPointUI();
        }
        if (this.radius === "0" || this._geoJSON.placemarks.type === 'LineString') {
          this._mapImpl.setRadius(this.radius, this._geoJSON.placemarks.type);
        } else {
          this._mapImpl.addRadius(idx);
        }
      }
      return marker;
    },
    _newMarkerHandler: function (latLng, idx) {
      var createOptions = {
        draggable: this.options.draggableMarkers
      };
      this._mapImpl.coordsPush(latLng);
      var marker = this._mapImpl.addMarker(idx, latLng, createOptions);
      if (this.options.draggableMarkers) {
        this._mapImpl.addMarkerMoveListener(idx, marker, this._markerMoveHandler(idx, marker), this);
        this._mapImpl.addMarkerDragEndListener(idx, marker, this._markerDragEndHandler(idx, marker), this);
      }
      var geoJSONLatLng = this._mapImpl.normalizeLatLngToGeoJson(latLng);
      if (this._geoJSON.placemarks.type === 'Point') {
        if (this._geoJSON.placemarks.coordinates.length === 0) {
          this._geoJSON.placemarks.coordinates = geoJSONLatLng;
        } else {
          var pointCoords = this._geoJSON.placemarks.coordinates;
          this._geoJSON.placemarks.coordinates = [pointCoords, geoJSONLatLng];
        }
      } else {
        this._geoJSON.placemarks.coordinates.push(geoJSONLatLng);
      }
      return marker;
    },
    _createLineString: function () {
      var shape = this._mapImpl.addLineString();
      this._geoJSON.placemarks.type = 'LineString';
      return shape;
    },
    _createPolygon: function () {
      this._removeMapShape();
      var shape = this._mapImpl.addPolygon();
      this._geoJSON.placemarks.type = 'Polygon';
      var coords = this._geoJSON.placemarks.coordinates;
      // We only support one polygon in this version
      // its LinearRing will always be the first element
      coords.push(coords[0]);
      this._geoJSON.placemarks.coordinates = [coords];
      this._geoJSON.properties.radius = 0;
      return shape;
    },
    _removeMapShape: function () {
      this._mapImpl.removeShapeFromMap();
    },
    _geoJSONToMap: function (geoJSON) {
      var radius = this.radius;
      if ('undefined' !== typeof geoJSON.properties) {
        if ('undefined' !== typeof geoJSON.properties.radius) {
          radius = geoJSON.properties.radius;
        }
      }

      var placemarks = geoJSON.placemarks;
      var placemarkType = placemarks.type;
      var plCoords = placemarks.coordinates;
      var coords = [];
      if (placemarkType === 'Point') {
        coords.push(this._mapImpl.makeLatLng(plCoords[1], plCoords[0]));
      } else {
        var lastItemIdx;
        // We only support one polygon in this version
        // its LinearRing will always be the first element
        if (placemarkType === 'Polygon') {
          plCoords = plCoords[0];
          lastItemIdx = plCoords.length - 1;
        } else {
          lastItemIdx = plCoords.length;
        }
        var i;
        for (i = 0; i < lastItemIdx; i = i + 1) {
          coords.push(this._mapImpl.makeLatLng(plCoords[i][1], plCoords[i][0]));
        }
      }
      this.clear();
      $.each(coords, $.proxy(function (i, point) {
        marker = this._newMarkerHandler(point, i);
        this.points.push(marker);
      }, this));
      this.makeLineString = (placemarkType !== 'MultiPoint');
      if (placemarkType === 'Polygon') {
        this._createPolygon();
        radius = 0;
      } else if (placemarkType === 'LineString') {
        this._createLineString();
        this.radius = radius;
      } else {
        this.radius = radius;
      }
      // TODO UI and icons
      this._mapImpl.setRadius(radius, geoJSON.placemarks.type);
    },
    _pointsClear: function () {
      this._mapImpl.removeMarkers();
      this.points = [];
    },
    destroy: function () {
      this._mapImpl.removeMapClickListener();
      this._mapImpl.removeMarkerMoveListeners();
      this._mapImpl.removeMarkerDragEndListeners();
      $.ui.simplicityWidget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
