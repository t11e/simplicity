(function ($) {
  $.simplicityDocsParseJson = function (input, defaultValue) {
      var result;
      try {
        result = JSON.parse(input);
      } catch (e) {
        try {
          result = eval( '(' + input + ')');
        } catch (e) {
          result = defaultValue;
        }
      }
      return result;
  };
  $.widget("ui.simplicityDocsJsonSelector", $.ui.simplicityWidget, {
    options: {
      selectElement: ''
    },
    _create: function () {
      $(this.options.selectElement)
        .change($.proxy(function (evt) {
          var json = $.simplicityDocsParseJson($(evt.target).val());
          this.element.text(JSON.stringify(json, null, '  '));
          this._trigger('change', {}, json);
        }, this));
    }
  });
  $.widget("ui.simplicityDocsStateEditor", $.ui.simplicityWidget, {
    options: {
      stateElement: ''
    },
    _create: function () {
      if (!this.element.is('textarea')) {
        return;
      }
      if (this.options.stateElement === '') {
        this.options.stateElement = this.element;
      }
      this
        ._addClass('ui-simplicity-state-example-editor')
        ._bind('change', this._val_handler)
        ._bind(this.options.stateElement, 'simplicityStateChange', this._state_handler);
    },
    _val_handler: function () {
      var json = $.simplicityDocsParseJson(this.element.val(), null);
      if (json === null) {
        this.element.addClass('ui-state-error');
      } else {
        this.element
          .removeClass('ui-state-error')
          .val(JSON.stringify(json, null, '    '));
        $(this.options.stateElement).simplicityState('state', json);
      }
    },
    _state_handler: function(evt, state) {
      this.element.val(JSON.stringify(state, null, '    '));
    }
  });
}(jQuery));
