/**
 * @name $.ui.simplicitySearchResults
 * @namespace Widget that displays the search results.
 *
 * This widget listens to the <code>simplicitySearchResponse</code> event and takes
 * the <code>resultsHtml</code> field from the search response, injecting it directly
 * into the page.
 * <p>
 * If your search controller does not inject the search results as HTML into it's response
 * then consider using <code>simplicityRenderParamsSearchResults</code> instead.
 */
(function ($) {
  $.widget("ui.simplicitySearchResults", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>searchElement</dt>
     *   <dd>
     *     The simplicityDiscoverySearch widget that this widget binds it's events to. Defaults to <code>'body'</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicitySearchResults.options
     */
    options: {
      searchElement: 'body'
    },
    _create : function () {
      this
        ._addClass('ui-simplicity-search-results')
        ._bind(this.options.searchElement, 'simplicitySearchResponse', this._searchResponseHandler);
    },
    /**
     * Event handler for the <code>simplicitySearchResponse</code> event. Expects the given
     * search response object to contain a <code>resultsHtml</code> field and splices it
     * directly into the page.
     *
     * @name $.ui.simplicitySearchResults._searchResponseHandler
     * @function
     * @private
     */
    _searchResponseHandler: function (evt, searchResponse) {
      var resultsHtml = searchResponse.resultsHtml || '';
      if (searchResponse.error) {
        var error = $('<div class="ui-state-error-text"/>');
        error.text('[' + searchResponse.status + '] ' + searchResponse.statusText + ((searchResponse.message) ? ", " + searchResponse.message : ""));
        this.element.append(error);
      } else {
        this.element.html(resultsHtml);
      }
    }
  });
}(jQuery));