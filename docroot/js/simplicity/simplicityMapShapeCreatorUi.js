/**
 * @name $.ui.simplicityMapShapeCreatorUi
 * @namespace A user interface for a simplicityMapShapeCreator. Saves its UI state
 * in a cookie with 6 days expiration.
 *
 */
// TODO Create Docs
(function ($) {
  $.widget("ui.simplicityMapShapeCreatorUi", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>shapeCreator</dt>
     *   <dd>
     *     Required shape creator instance.
     *   </dd>
     *   <dt>allowedShapes</dt>
     *   <dd>
     *     Set this to an array of shape types that are supported. Valid values
     *     are <code>MultiPoint</code> and <code>Polygon</code>.
     *     Defaults to <code>['Polygon']</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicityMapShapeCreatorUi.options
     */
    options: {
      shapeCreator: '',
      allowedShapes: ['Polygon'],
      helpPosition: {left: 300, top: -148},
      defaultRadius: 1,
      radiusImpl: 'select',
      template:
        '<div>' +
          '<input class="draw" id="simplicityMapCreatorDrawButton" type="checkbox" />' +
          ' <label class="drawlabel" for="simplicityMapCreatorDrawButton" title="Start drawing a shape to search on the map.">Create a Shape</label>' +
          '<button class="showhelp">Help</button>' +
          '<button class="search" title="Search using the current shape">Search</button>' +
          '<input class="linker" id="simplicityMapCreatorLinkButton" type="checkbox" checked="checked" />' +
          ' <label class="linkerlabel" for="simplicityMapCreatorLinkButton" title="Click to create points only">●­­–●–●</label>' +
          '<select class="radius"/>' +
          '<input class="geocoder" type="text" />' +
          '<button class="clear" title="Clear any drawn shape">Clear</button>' +
        '</div>',
      helpTemplate:
          '<div class="help ui-corner-all ui-helper-clearfix">' +
             '<div class="text">' +
                '<div class="background ui-corner-all"></div>' +
                '<p>To draw a shape, click to create the first point.<br/>' +
                'Click in another location to create the next point.</p>' +
                '<p>To complete the shape, click the first point or click the Stop button.</p>' +
             '</div>' +
             '<div class="closer ui-corner-all" title="Close this help message">×</div>' +
         '</div>'
    },
    _create: function () {
      if (this.options.shapeCreator === '') {
        // impl is required
        return;
      }
      this.shapeCreator = $(this.options.shapeCreator);
      this.mapImpl = this.shapeCreator.simplicityMapShapeCreator('mapImpl');
      this.shapeCreator.simplicityMapShapeCreator('setRadius', this.options.defaultRadius);
      this.helpHidden = false;
      if (this.options.radiusImpl === 'select') {
        this._radiusImpl = 'simplicityMapShapeCreatorRadiusAsSelectUi';
      } else if (this.options.radiusImpl === 'buttonset') {
        this._radiusImpl = 'simplicityMapShapeCreatorRadiusAsButtonsetUi';
      } else {
        // Invalid
        return;
      }
      this.ui = $(this.element);
      this._createUi();
      this.SETTINGS_COOKIE = "settings";
      this._getSettings(this.SETTINGS_COOKIE);
      this
        ._addClass('ui-simplicity-map-shape-creator-ui')
        ._bind(this.shapeCreator, 'simplicitymapshapecreatorshapechange', this._shapeChangedHandler);
    },
    _radiusChangedHandler: function (evt, ui) {
      this._ignoreChangeEvent = true;
      try {
        this.shapeCreator.simplicityMapShapeCreator("setDistance", ui.radius);
      } finally {
        this._ignoreChangeEvent = false;
      }
    },
    _shapeChangedHandler: function (evt, ui) {
      if (!this._ignoreChangeEvent) {
        if ('undefined' !== typeof ui.geoJSON) {
          var geoJSON = ui.geoJSON;
          if ('undefined' !== typeof geoJSON.placemarks) {
            if (geoJSON.placemarks.coordinates.length > 0) {
              if ('undefined' !== typeof geoJSON.placemarks.type) {
                var shapeType = geoJSON.placemarks.type;
                var radiusValidForShape = (shapeType === 'Point' || shapeType === 'MultiPoint' || shapeType === 'LineString');
                this.radiusInput[this._radiusImpl]("enable", radiusValidForShape);
                if ('undefined' !== typeof geoJSON.properties) {
                  if (radiusValidForShape && 'undefined' !== typeof geoJSON.properties.exactDistance) {
                    this.radiusInput[this._radiusImpl]("setRadius", geoJSON.properties.exactDistance);
                  }
                }
                if (shapeType === 'MultiPoint') {
                  $('#simplicityMapCreatorLinkButton').removeAttr("checked");
                  this._setMakeLinesChanged(false);
                }
              } else {
                if ($('#simplicityMapCreatorDrawButton').is(':checked')) {
                  $('#simplicityMapCreatorDrawButton')
                  .removeAttr('checked')
                  .button('refresh');
                  this._disable();
                  this.radiusInput[this._radiusImpl]("setRadius", this.options.defaultRadius);
                }
              }
            }
          }
        }
      }
    },
    _createUi: function () {
      this.helpMsg = $(this.helpTemplate).draggable().hide().css(this.options.helpPosition);
      this.helpMsg.find(".background")
        .css({ opacity: 0.5});
      this.helpMsg
        .find(".closer")
        .click($.proxy(function () {
          this.helpMsg.fadeOut('slow', $.proxy(function () {
            this.helpMsg.detach();
            this.helpHidden = true;
            this._saveSettings(this.SETTINGS_COOKIE);
          }, this));
        }, this));

      this.ui.html(this.options.template);

      this.mapclicklabel = this.ui.find('.drawlabel');
      this.ui.find('.draw')
        .button()
        .click($.proxy(
          function (evt) {
            this[evt.currentTarget.checked ? "_enable" : "_disable"]();
          }, this));

      this.helpButton = this.ui.find('.showhelp')
        .button({
          icons: {
            primary: "ui-icon-help"
          },
          text: false
        })
        .click($.proxy(function () {
          if (this.helpHidden) {
            this.helpMsg.appendTo(this.element);
            this.helpMsg.fadeIn('slow');
            this.helpHidden = false;
            this._saveSettings(this.SETTINGS_COOKIE);
          }
        }, this));

      this.ui.find('.search')
        .button({
          icons: {
            primary: "ui-icon-search"
          },
          text: false
        })
        .click($.proxy(function (evt) {
            this.shapeCreator.simplicityMapShapeCreator("changeHandler", true);
          }, this));

      this.ui.find('.clear')
      .button({
        icons: {
          primary: "ui-icon-circle-close"
        },
        text: false
      })
      .click($.proxy(function (evt) {
          var checked = $('#simplicityMapCreatorDrawButton').is(':checked');
          this.shapeCreator.simplicityMapShapeCreator(checked ? "clear" : "reset");
          this.geocoder.val('');
          if (checked) {
            this._enable();
          }
        }, this));

      if ($.inArray('MultiPoint', this.options.allowedShapes) > -1) {
        this.ui.find('.linker')
          .button()
          .button('disable')
          .click($.proxy(function (evt) {
            var connect = evt.currentTarget.checked;
            this._setMakeLinesChanged(connect);
            try {
              this._ignoreChangeEvent = true;
              this.shapeCreator.simplicityMapShapeCreator("connect", connect);
            } finally {
              this._ignoreChangeEvent = false;
            }
          }, this));
      } else {
        this.ui.find('.linker').hide();
        this.ui.find('.linkerlabel').hide();
      }

      // Radius
      this.radiusInput = this.ui.find('.radius')[this._radiusImpl]({
        defaultRadius: this.options.defaultRadius
      });
      this
        ._bind(this.radiusInput, this._radiusImpl.toLowerCase() + 'radiuschange', this._radiusChangedHandler);

      // geocoder
      this.geocoder = this._createGeocoder(this.ui);
    },
    _createGeocoder: function (ui) {
      var selectCallback = $.proxy(function (evt, ui) {
        if (ui.item) {
          try {
            this._ignoreChangeEvent = true;
            this.shapeCreator.simplicityMapShapeCreator("clear");
          } finally {
            this._ignoreChangeEvent = false;
          }
          var marker = this.shapeCreator.simplicityMapShapeCreator("newMarkerAt", ui.item.latitude, ui.item.longitude);
          this.mapImpl.setMapCenterFromMarker(marker);
        }
      }, this);
      var geocoderId = 'simplicity' + this.mapImpl.providerId() + 'Geocoder';
      var autocompleteMenu = $('<span/>')
        .addClass("ui-simplicity-map-shape-creator-ui-geocoder-menu")
        .appendTo($('body'));
      var geocoder = $(this.element)[geocoderId]();
      var ctrl = ui.find('.geocoder')
        .autocomplete({
          autoFocus: true,
          source: geocoder[geocoderId]('autocompleteSource'),
          select: selectCallback,
          change: selectCallback,
          appendTo: autocompleteMenu
        });
      if (ctrl.watermark) {
        ctrl.watermark("Enter a location");
      }
      return ctrl;
    },
    setRadius: function (radius) {
      if (this.currentRadius !== radius) {
        this.radiusInput[this._radiusImpl]("setRadius", radius);
        this.currentRadius = radius;
      }
    },
    _enable: function () {
      this.ui.find(".drawlabel")
        .attr("title", "Stop drawing.")
        .find('span')
        .text('Stop');
      if (!this.helpHidden) {
        this.helpMsg.appendTo(this.element);
        this.helpMsg.fadeIn('slow');
      }
      this.radiusInput[this._radiusImpl]("enable", true);
      this.ui.find(".drawlabel").button('enable');
      this.geocoder.attr("disabled", "true");
      this.helpButton.button('enable');
      try {
        this._ignoreChangeEvent = true;
        this.shapeCreator.simplicityMapShapeCreator("draw", true);
      } finally {
        this._ignoreChangeEvent = false;
      }
    },
    _disable: function () {
      this.ui.find(".drawlabel")
        .attr("title", "Start drawing a shape to search on the map.")
        .find('span')
        .text('Create a Shape');
      this.helpMsg.fadeOut('slow', $.proxy(function () {
        this.helpMsg.detach();
      }, this));
      this.radiusInput[this._radiusImpl]("enable", false);
      this.ui.find(".linker").button('disable');
      this.geocoder.removeAttr("disabled");
      this.helpButton.button('disable');
      try {
        this._ignoreChangeEvent = true;
        this.shapeCreator.simplicityMapShapeCreator("draw", false);
      } finally {
        this._ignoreChangeEvent = false;
      }
    },
    _setMakeLinesChanged: function (value) {
      this.ui.find(".linkerlabel")
        .attr("title", value ? 'Click to create points only' : 'Click to create lines and polygons')
        .find('span')
        .text(value ? '●­­–●–●' : '● ● ●');
      this.ui.find(".linker").button('refresh');
      if (!value) {
        this.radiusInput[this._radiusImpl]("enable", true);
      }
    },
    _saveSettings: function (cookiename) {
      var expiresDays = 6;
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiresDays);
      var value = JSON.stringify({"helpHidden": this.helpHidden});
      document.cookie = cookiename + "=" + escape(value) + "; expires=" + exdate.toUTCString();
    },
    _getSettings: function (cookiename) {
      var x, y, cookies = document.cookie.split(";");
      $.each(cookies, $.proxy(function (i, cookie) {
        x = cookies[i].substr(0, cookies[i].indexOf("="));
        y = cookies[i].substr(cookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x === cookiename) {
          var settings = JSON.parse(unescape(y));
          if ('undefined' !== typeof settings.helpHidden) {
            this.helpHidden = settings.helpHidden;
          }
          return false;
        }
      }, this));
    },
    destroy: function () {
      this.helpMsg = null;
      $.ui.simplicityWidget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
