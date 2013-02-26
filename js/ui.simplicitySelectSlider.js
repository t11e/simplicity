/**
 * @name $.ui.simplicitySelectSlider
 * @namespace Single handled slider bound to a select input.
 * <p>
 * Creates a progressive enhanced jQuery UI slider that is backed by a <code>select</code> input.
 * <p>
 * The widget options are passed through to the created slider. For more information see the
 * jQuery UI slider <a href="http://jqueryui.com/demos/slider/">documentation</a>.
 *
 * @example
 *   &lt;select id="weight" name="w">
 *     &lt;option value="l">Light&lt;/option>
 *     &lt;option value="m">Medium&lt;/option>
 *     &lt;option value="h">Heavy&lt;/option>
 *   &lt;select>
 *   &lt;div id="weightSlider">&lt;/div>
 *   &lt;script type="text/javascript">
 *     $('#weightSlider').simplicitySelectSlider({
 *       select: '#weight'
 *     });
 *   &lt;/script>
 */
(function ($) {
  $.widget("ui.simplicitySelectSlider", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>select</dt>
     *   <dd>
     *     A single <code>select</code> input to associate the slider handle with.
     *   </dd>
     *   <dt>secondSelect</dt>
     *   <dd>
     *     Enables dual-handle mode and specifies a single <code>select</code> input to associate
     *     the second slider handle with. Defaults to <code>''</code> which leaves the widget in
     *     single handle mode.
     *   </dd>
     *   <dt>allowHandleOverlap</dt>
     *   <dd>
     *     Only affects dual-handled sliders and controls whether the two handles can have
     *     the same position. Defaults to <code>false</code>.
     *   </dd>
     *   <dt>populateSecondSelect</dt>
     *   <dd>
     *     Only affects dual-handled sliders and controls how the widget deals with missing
     *     options in the second <code>select</code> input. When <code>true</code> it will
     *     automatically populate them with the label from the primary <code>select</code>.
     *     Defaults to <code>false</code>.
     *   </dd>
     *   <dt>changeOnSlide</dt>
     *   <dd>
     *      Set this to <code>true</code> to cause <code>slide</code> events to change the
     *      bound <code>select</code> input. Defaults to <code>false</code>.
     *   </dd>
     *   <dt>showTicks</dt>
     *   <dd>
     *      Set this to <code>true</code> to cause the display of tick marks on the slider.
     *      Defaults to <code>true</code>.
     *   </dd>
     *   <dt>showLabels</dt>
     *   <dd>
     *     Set this to <code>true</code> to cause the display of labels under the tick marks
     *     of the slider. All labels are displayed, if you have too many labels then you
     *     will want to disable this option. Defaults to <code>true</code>.
     *   </dd>
     *   <dt>centerLabels</dt>
     *   <dd>
     *     When labels are displayed this option causes their css to be adjusted to cause them
     *     to be centered around their tick mark. You would disable this if you had fixed width
     *     labels and wanted to fully control their position from css.
     *     Defaults to <code>true</code>.
     *   </dd>
     *   <dt>justifyEndLabels</dt>
     *   <dd>
     *     When labels are displayed this option causes the first label to be left justified and
     *     the right label to be right justified with the ends of the slider. You would disable
     *     this if you had fixed width labels and wanted to fully control their position from css.
     *     Defaults to <code>true</code>.
     *   </dd>
     *   <dt>showTooltip</dt>
     *   <dd>
     *     Set this to <code>true</code> to cause a tooltip to appear above the slider handle.
     *     Defaults to <code>false</code>.
     *   </dd>
     *   <dt>centerTooltip</dt>
     *   <dd>
     *     When tooltip display is enabled this option causes the tooltip to be centered on
     *     the slider handle. You would disable this if you had a fixed width tooltip and wanted
     *     to fully control it's position from css.
     *     Defaults to <code>true</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicitySelectSlider.options
     */
    options : {
      select: '',
      secondSelect: '',
      allowHandleOverlap: false,
      populateSecondSelect: false,
      changeOnSlide: false,
      showTicks: true,
      showLabels: true,
      centerLabels: true,
      justifyEndLabels: true,
      showTooltip: true,
      centerTooltip: true,
      scaleTemplate: '' +
        '<ol class="ui-simplicity-select-slider-scale ui-helper-reset">' +
          '<li class="ui-simplicity-select-slider-position">' +
            '<span class="ui-simplicity-select-slider-label"></span>' +
            '<span class="ui-simplicity-select-slider-tick ui-widget-content"></span>' +
          '</li>' +
        '</ol>',
      tooltipTemplate: '' +
        '<span class="ui-simplicity-select-slider-tooltip ui-widget-content ui-corner-all">' +
          '<span class="ui-simplicity-select-slider-tooltip-content"></span>' +
          '<span class="ui-simplicity-select-slider-tooltip-pointer-down ui-widget-content">' +
            '<span class="ui-simplicity-select-slider-tooltip-pointer-down-inner"></span>' +
          '</span>' +
        '</span>'
    },
    _create : function () {
      this._select = $(this.options.select);
      if (this._select.length === 0 || !this._select.is('select')) {
        return;
      }
      this._addClass('ui-simplicity-select-slider');
      this._secondSelect = $(this.options.secondSelect);
      if (this._secondSelect.length !== 0 && !this._secondSelect.is('select')) {
        this._secondSelect = $('');
      }
      var sliderOptions = {
        min: 0,
        max: this._sliderMax()
      };
      if (this._secondSelect.length !== 0) {
        $.extend(sliderOptions, {
          values: [sliderOptions.min, sliderOptions.max],
          range: true
        });
      }
      this.element.slider($.extend(sliderOptions, this.options));

      var scale = $(this.options.scaleTemplate);
      scale.find('.ui-simplicity-select-slider-position').remove();
      this.element.append(scale);

      var tooltip = $(this.options.tooltipTemplate);
      if (!this.options.showTooltip) {
        tooltip.hide();
      }
      this.element.find('.ui-slider-handle').append(tooltip);

      this._bind('slidechange', this._sliderChangeHandler);
      this._bind('slide', this._sliderChangeHandler);
      this._bind(this._select, 'change', this._selectChangeHandler);
      this._bind(this._secondSelect, 'change', this._selectChangeHandler);
      this.refreshScale();
      this.refreshTooltip();
    },
    /**
    * Override of <code>_setOption</code> that is used to refresh the
    * slider tick marks, labels and tooltip when the assocaited options
    * are changed.
    *
    * @name $.ui.simplicitySelectSlider._setOption
    * @function
    * @private
    */
    _setOption: function (option, value) {
      $.ui.simplicityWidget.prototype._setOption.apply(this, arguments);
      switch (option) {
      case 'showTicks':
      case 'showLabels':
      case 'centerLabels':
      case 'justifyEndLabels':
        this.refreshScale();
        break;
      case 'showTooltip':
      case 'centerTooltip':
        this.refreshTooltip();
        break;
      }
    },
    /**
     * Event handler for the <code>change</code> event on the <code>select</code> input.
     *
     * Updates the slider with the new value.
     *
     * @name $.ui.simplicitySelectSlider._selectChangeHandler
     * @function
     * @private
     */
    _selectChangeHandler: function (evt, ui) {
      if (!this._ignoreChangeEvent) {
        var changed = false;
        var max = this._sliderMax();
        if (max !== this.element.slider('option', 'max')) {
          // The select input was dynamically changed, alter the accepted range of
          // values for the slider.
          this.element.slider('option', 'max', max);
          this.refreshScale();
          changed = true;
        }
        if (this._secondSelect.length === 0) {
          // Single handled slider, no mapping necessary
          var selectIndex = this._select[0].selectedIndex;
          var sliderIndex = this.element.slider('option', 'value');
          if (changed || selectIndex !== sliderIndex) {
            this.element.slider('option', 'value', selectIndex);
          }
        } else {
          // Dual handled slider, use this._select to convert val to/from slider index.
          var selectVals = [this._select.val(), this._secondSelect.val()];
          var sliderIndexes = this.element.slider('option', 'values');
          var sliderVals = [this._sliderIndexToVal(sliderIndexes[0]), this._sliderIndexToVal(sliderIndexes[1])];
          if (changed || selectVals[0] !== sliderVals[0] || selectVals[1] != sliderVals[1]) {
            var selectIndexes = [this._sliderIndexFromVal(selectVals[0]), this._sliderIndexFromVal(selectVals[1], 1)];
            this.element.slider('option', 'values', selectIndexes);
          }
        }
      }
    },
    /**
     * Recreates the scale on the slider. This contains the tick marks and labels.
     * Tick marks and labels are created only if shown. Toggling the <code>showTicks</code>
     * or <code>showLabels</code> options will cause this method to be called and the
     * ticks or labels to be created.
     *
     * @name $.ui.simplicitySelectSlider.refreshScale
     * @function
     * @private
     */
    refreshScale: function () {
      var scale = this.element.find('.ui-simplicity-select-slider-scale');
      scale.find('.ui-simplicity-select-slider-position').remove();
      var positionTemplate = $(this.options.scaleTemplate).find('.ui-simplicity-select-slider-position').remove();
      if (positionTemplate.length) {
        var min = this.element.slider('option', 'min');
        var max = this.element.slider('option', 'max');
        for (var i = min; i <= max; i += 1) {
          var left = (i / (max - min) * 100).toFixed(2);
          var position = positionTemplate.clone()
            .addClass(i === min ? 'ui-simplicity-select-slider-position-first' : i === max ? 'ui-simplicity-select-slider-position-last' : '')
            .attr('style', 'left:' + left + '%');
          if (!this.options.showTicks) {
            position.find('.ui-simplicity-select-slider-tick').hide();
          }
          var label = null;
          if (this.options.showLabels) {
            var selectVal = this._sliderIndexToVal(i);
            var labelText = this._selectValToLabel(selectVal);
            label = position.find('.ui-simplicity-select-slider-label');
            label.text(labelText);
          }
          scale.append(position);
          var center = this.options.centerLabels;
          var justify = this.options.justifyEndLabels;
          if (label !== null && (center || justify)) {
            if (justify && i === min) {
              // Do nothing.
            } else if (justify && i === max) {
              label.css('marginLeft', -label.width());
            } else if (center) {
              label.css('marginLeft', -label.width() / 2);
            }
          }
        }
      }
    },
    /**
     * Updates the content of the tooltip(s) and hides or shows it as appropriate.
     *
     * @name $.ui.simplicitySelectSlider.refreshTooltip
     * @function
     * @private
     */
    refreshTooltip: function (handleNum, sliderIndex) {
      if (arguments.length === 0) {
        this.refreshTooltip(0);
        if (this._secondSelect.length !== 0) {
          this.refreshTooltip(1);
        }
        return;
      }
      var tooltip = this.element.find('.ui-simplicity-select-slider-tooltip:' + (handleNum === 1 ? 'last' : 'first'));
      if (tooltip.length) {
        if (!this.options.showTooltip) {
          tooltip.hide();
        }
        if ('undefined' === typeof sliderIndex) {
          if (this._secondSelect.length === 0) {
            sliderIndex = this.element.slider('value');
          } else {
            sliderIndex = this.element.slider('values')[handleNum];
          }
        }
        var selectVal = this._sliderIndexToVal(sliderIndex);
        var label = this._selectValToLabel(selectVal, handleNum);
        tooltip.find('.ui-simplicity-select-slider-tooltip-content').text(label);
        if (this.options.showTooltip && this.options.centerTooltip) {
          var left = -(tooltip.width() / 2) - 2;
          tooltip.css('marginLeft', left + 'px');
        }
        if (this.options.showTooltip && label !== '') {
          tooltip.show();
        }
      }
    },
    /**
     * Event handler for the <code>slidechange</code> and <code>slide</code> events.
     * Updates the associated <code>select</code> input with the new slider value.
     * <p>
     * This handler calls <code>change()</code> on the <code>select</code> input
     * immediately after changing it's value.
     *
     * @name $.ui.simplicitySelectSlider._sliderChangeHandler
     * @function
     * @private
     */
    _sliderChangeHandler: function (evt, ui) {
      if (typeof ui.values === 'undefined') {
        // Single handled slider
        this._sliderHandleToSelect(evt.type, ui.value);
      } else {
        // Dual handled slider
        if (!this.options.allowHandleOverlap && ui.values[0] === ui.values[1]) {
          return false;
        }
        this._sliderHandleToSelect(evt.type, ui.values[0]);
        this._sliderHandleToSelect(evt.type, ui.values[1], 1);
      }
    },
    _sliderHandleToSelect: function (eventType, sliderIndex, handleNum) {
      var select = handleNum === 1 ? this._secondSelect : this._select;
      if (select.length > 0) {
        this._ignoreChangeEvent = true;
        try {
          // Lookup the canonical value from the primary select
          var newVal = this._sliderIndexToVal(sliderIndex);
          // Use to sync with the select bound to this particular handle
          if (newVal !== select.val()) {
            select.val(newVal);
            if (this.options.populateSecondSelect && handleNum === 1 && select.val() !== newVal) {
              $('<option/>')
                .val(newVal)
                .text(this._selectValToLabel(newVal))
                .appendTo(select);
              select.val(newVal);
            }
          }
          this.refreshTooltip(handleNum, sliderIndex);
          if (eventType !== 'slide' || this.options.changeOnSlide) {
            select.change();
          }
        } finally {
          this._ignoreChangeEvent = false;
        }
      }
    },
    _sliderMax: function () {
      var max = this._select.find('option').length - 1;
      if (this._secondSelect.length !== 0 && this._select.find('option[value=""]').length === 1) {
        max += 1;
      }
      return max;
    },
    _sliderIndexToVal: function (index) {
      var val = $(this._select).find('option:eq(' + index + ')').val();
      return typeof val !== 'undefined' ? val : '';
    },
    _sliderIndexFromVal: function (val, handleNum) {
      var result = -1;
      var options = this._select.find('option');
      if (val !== '') {
        options.each(function (idx, option) {
          if ($(option).val() === val) {
            result = idx;
            return false;
          }
        });
      }
      return result !== -1 ? result : handleNum === 1 ? options.length : 0;
    },
    _selectValToLabel: function (val, handleNum) {
      var select = handleNum == 1 ? this._secondSelect : this._select;
      var options = select.find('option');
      var result = '';
      options.each(function (idx, option) {
        option = $(option);
        if (option.val() === val) {
          result = option.text();
          return false;
        }
      });
      if (result === '' && handleNum === 1) {
        // Missing label in second select, use the label from the primary select instead.
        result = this._selectValToLabel(val);
      }
      return result;
    },
    destroy: function () {
      this.element.slider('destroy');
      this.element.children().remove();
      $.ui.simplicityWidget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
