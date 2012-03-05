/**
 * @name $.ui.simplicityMapShapeCreatorRadiusAsSelectUi
 *
 */
(function ($) {
  $.widget("ui.simplicityMapShapeCreatorRadiusAsSelectUi", $.ui.simplicityWidget, {
    /**
     * Widget options.
     */
    options: {
      distance: [0.5, 1, 5, 10, 20, 50, 0],
      labels: ['½', null, null, null, null, null, 'None'],
      defaultRadius: 1
    },
    _create: function () {
      this.currentRadius = this.options.defaultRadius;
      var r = this.options.distance;
      var l = this.options.labels;
      var select = $(this.element);
      $.each(r, $.proxy(function (idx, dist) {
        var opt =
          $('<option/>')
            .attr({'value': dist})
            .text(dist === 0 ? l[idx] : (l[idx] || dist) + " mile" + ((dist <= 1 && dist > 0) ? '' : 's'));
        select.append(opt);
      }, this));
      select.change($.proxy(function (evt) {
        this.setRadius(evt.currentTarget.value);
        var ui = {
            radius: evt.currentTarget.value
          };
        this._trigger('radiusChange', {}, ui);
      }, this));
      select.find("option[value='" + this.options.defaultRadius + "']").attr("selected", "selected");
      this.radiusInput = select;
      this.setRadius(this.options.defaultRadius);
      this
        ._addClass('ui-simplicity-map-shape-creator-radius-select-ui')
        ._bind(this.shapeCreator, 'simplicitymapshapecreatorshapechange', this._shapeChangedHandler);

    },
    _shapeChangedHandler: function (evt, ui) {
    },
    getRadius: function () {
      return this.radiusInput.val();
    },
    setRadius: function (radius) {
      if (this.currentRadius !== radius) {
        this.radiusInput.find("option[value='" + radius + "']").attr("selected", "selected");
        this.currentRadius = radius;
      }
    },
    enable: function (enable) {
      if (enable) {
        this.radiusInput.removeAttr("disabled");
      } else {
        this.radiusInput.attr("disabled", true);
      }
    }
  });
}(jQuery));
