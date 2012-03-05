/**
 * @name $.ui.simplicityMapShapeCreatorRadiusAsButtonsetUi
 *
 */
(function ($) {
  $.widget("ui.simplicityMapShapeCreatorRadiusAsButtonsetUi", $.ui.simplicityWidget, {
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

      var buttonset =
        $(this.element)
          .attr({"style": "font-size: 0.4em;"});
      $.each(r, $.proxy(function (idx, dist) {
        var radio =
        $('<input/>')
          .attr({
            'id': 'simplicityMapCreatorRadius' + idx,
            'type': 'radio',
            'name': 'simplicityMapCreatorRadius',
            'value': dist
          })
         .click($.proxy(function (evt) {
            this.setRadius(evt.srcElement.value);
            var ui = {
                radius: evt.srcElement.value
              };
            this._trigger('radiusChange', {}, ui);
          }, this));
        if (dist === this.options.defaultRadius) {
          radio.attr('checked', 'checked');
        }
        buttonset.append(radio);
        buttonset.append($('<label/>')
          .attr({'for': 'simplicityMapCreatorRadius' + idx})
          .text(l[idx] ? l[idx] : dist));
      }, this));
      buttonset.buttonset();
      $('<label/>').text(' Miles Around: ').appendTo(this.element);
      this.element.append(ctrl);

      this.radiusInput = buttonset;
      this.setRadius(this.options.defaultRadius);
      this
        ._addClass('ui-simplicity-map-shape-creator-radius-select-ui')
        ._bind(this.shapeCreator, 'simplicitymapshapecreatorshapechange', this._shapeChangedHandler);

    },
    _shapeChangedHandler: function (evt, ui) {
    },
    getRadius: function () {
      return this.radiusInput.find('input[name=simplicityMapCreatorRadius]:checked').val();
    },
    setRadius: function (radius) {
      if (this.currentRadius !== radius) {
        this.radiusInput.find(':checked').removeAttr('checked');
        this.radiusInput.find('input[value="' + radius + '"]').attr('checked', 'checked');
        this.currentRadius = radius;
      }
    },
    enable: function (enable) {
      this.radiusInput.buttonset(enable ? 'enable' : 'disable');
      this.radiusInput.buttonset('refresh');
    }
  });
}(jQuery));
