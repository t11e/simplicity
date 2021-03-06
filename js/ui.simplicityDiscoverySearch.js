/**
 * @name $.ui.simplicityDiscoverySearch
 * @namespace Performs a search against the Discovery Search Engine
 *
 * @example
 *   $('body').simplicityState();
 *   // Create all simplicityInputs widgets
 *   $('body')
 *     .simplicityState('mergeQueryParams')
 *     .simplicityHistory()
 *     .simplicityState('triggerChangeEvent')
 *     .simplicityPageSnapBack()
 *     <b>.simplicityDiscoverySearch({
 *       url: '/my_search_controller.php'
 *     })</b>
 *     <b>.simplicityDiscoverySearch('search');</b>
 */
(function ($) {
  $.widget("ui.simplicityDiscoverySearch", $.ui.simplicityWidget, {
    /**
     * Widget options.
     *
     * <dl>
     *   <dt>url</dt>
     *   <dd>
     *     The required url to submit the search query.
     *   </dd>
     *   <dt>stateElement</dt>
     *   <dd>
     *     The location of the simplicityState widget. Defaults to <code>'body'</code>.
     *   </dd>
     *   <dt>searchOnStateChange</dt>
     *   <dd>
     *     When <code>true</code> triggers a search everytime the state changes. Defaults to <code>true</code>.
     *   </dd>
     *   <dt>initialSearchResponse</dt>
     *   <dd>
     *     The initial search response. Used when a page has a server-side search triggered during load.
     *     Defaults to <code>{}</code>.
     *   </dd>
     *   <dt>backend</dt>
     *   <dd>
     *     Defaults to 'controller', change to 'engine' to allow for direct queries to an engine.
     *   </dd>
     *   <dt>controllerCallback</dt>
     *   <dd>
     *     The a provided callback that completes or modifies the search query when option <code>backend</code>
     *     is 'engine'. Defaults to <code>''</code>.
     *   </dd>
     *   <dt>dataType</dt>
     *   <dd>
     *     Defaults to 'json', change to 'jsonp' to allow for cross domain search controller support.
     *     This requires that your search controller output valid JSONP.
     *   <dt>debug</dt>
     *   <dd>
     *     Enable logging of key events to <code>console.log</code>. Defaults to <code>false</code>.
     *   </dd>
     *   <dt>profile</dt>
     *   <dd>
     *     When <code>true</code> requests query profile data from the engine. The profile data
     *     can be used to analyze engine query response times. Defaults to <code>false</code>.
     *   </dd>
     *   <dt>triggerFacetCountEvent</dt>
     *   <dd>
     *     When <code>true</code> enables triggering of facet count events. Defaults to <code>false</code>.
     *   </dd>
     *   <dt>triggerResultSetEvent</dt>
     *   <dd>
     *     When <code>true</code> enables triggering of the simplicitySearchResultSet event. Defaults to <code>false</code>.
     *   </dd>
     *   <dt>extractResultSet</dt>
     *   <dd>
     *     When <code>true</code> a standardized resultSet dictionary is available. Defaults to <code>true</code>.
     *   </dd>
     * </dl>
     * @name $.ui.simplicityDiscoverySearch.options
     */
    options: {
      url: '',
      backend: 'controller',
      stateElement: 'body',
      searchOnStateChange: true,
      initialSearchResponse: {},
      dataType: 'json',
      debug: false,
      triggerFacetCountEvent: false,
      triggerResultSetEvent: false,
      extractResultSet: true,
      profile: false,
      getPayloadParam: ''
    },
    _create: function () {
      this._addClass('ui-simplicity-discovery-search');
      this.searchResponse(this.options.initialSearchResponse, false);
      this._bind(this.options.stateElement, 'simplicityStateChange', this._stateChangeHandler);
      this._ajaxHelper = $.simplicity.ajaxHelper(this);
    },
    _stateChangeHandler: function (evt, state) {
      if (this.options.searchOnStateChange) {
        this.search(state);
      }
    },
    /**
     * Runs a search. The search happens asynchronously and will trigger multiple events.
     * <ul>
     *   <li>simplicitySearchSearching (before the ajax request is dispatched). This event may be
     *   triggered multiple times in advance of the simplicitySearchResponse event. For example,
     *   if any in-flight requests were aborted before the response has been handled, only the last
     *   non-aborted response will trigger simplicitySearchResponse.</li>
     *   <li>simplicitySearchResponse (original response)</li>
     *   <li>ajaxSetup</li>
     *   <li>ajaxSuccess</li>
     *   <li>ajaxError</li>
     *   <li>simplicityFacetCounts</li>
     *   <li>simplicityResultSet</li>
     * </ul>
     *
     * @param searchState
     *   The search state as a JSON compatible <code>Object</code>. This is an optional parameter,
     *   if not specified the search state is obtained from the <code>simplicityState</code> widget.
     *
     * @name $.ui.simplicityDiscoverySearch.search
     * @function
     *
     * @example
     *   // Bind to a search button
     *   $('#searchButton').click(function (evt) {
     *     $('body').simplicityDiscoverySearch('search');
     *   });
     */
    search: function (stateOrDiscoveryRequest) {
      if (this.options.url === '') {
        if (this.options.debug) {
          console.log("Option url is required.");
        }
        return;
      }
      if (arguments.length === 0) {
        if (this.options.backend === 'engine' && !$.isFunction(this.options.controllerCallback)) {
          if (this.options.debug) {
            console.log("Backend type 'engine' requires controllerCallback to be valid function.");
          }
          return;
        }
        stateOrDiscoveryRequest = $(this.options.stateElement).simplicityState('state');
      }
      var request;
      if ($.isFunction(this.options.controllerCallback)) {
        request = this.options.controllerCallback(stateOrDiscoveryRequest);
      } else {
        request = stateOrDiscoveryRequest;
      }
      var ajaxData = request;
      if (this.options.dataType === 'jsonp') {
        if (this.options.getPayloadParam !== '') {
          ajaxData = {};
          ajaxData[this.options.getPayloadParam] = JSON.stringify(request);
        }
      } else if (this.options.backend === 'engine') {
        ajaxData = JSON.stringify(request);
      }
      if (this.options.debug) {
        console.log('Searching by "', this.options.backend, '" for ', this.element, 'with request', ajaxData);
      }
      var ajaxOptions = {
          url: this.options.url,
          type: this.options.backend === 'controller' || this.options.dataType === 'jsonp' ? "GET" : "POST",
          contentType: 'application/json',
          data: ajaxData,
          dataType: this.options.dataType,
          cache: false,
          beforeSend: $.proxy(this._beforeSend, this),
          debug: this.options.debug,
          error: this._errorHandler,
          success: function (data, textStatus, xhr) {
            if (this.options.debug) {
              console.log('Search success for', this.element, 'with response', data);
            }
            this.element.triggerHandler('ajaxSuccess', data, textStatus, xhr);
            this._addHeadersToResponse(data, xhr);
            if (this.options.backend === "engine") {
              // decorate engine response for compatibility with widgets
              data = {
                _discovery: {
                  request: request,
                  response: data
                }
              };
            }
            this.searchResponse(data);
          }
        };
      this.element.triggerHandler('simplicitySearchSearching');
      this.element.triggerHandler('ajaxSetup', ajaxOptions);
      this._ajaxHelper.ajax(ajaxOptions);
    },
    _beforeSend: function (xhr) {
      if (this.options.profile) {
        xhr.setRequestHeader('X-Profile', 1);
      }
    },
    _addHeadersToResponse: function (response, xhr) {
      var profile = xhr.getResponseHeader('X-Profiling-Trace');
      if (profile > '') {
        response._discovery.profile = profile.substr(5).split(', >>>   ');
      }
    },
    _errorHandler: function (xhr, textStatus, message) {
      if (this.options.debug) {
        console.log('Search error for', this.element, 'textStatus:', textStatus, 'arguments', arguments);
      }
      this.element.triggerHandler('ajaxError', xhr, textStatus, message);
      this.searchResponse({
        error: true,
        xhr: xhr,
        status: xhr.status,
        statusText: textStatus,
        message: message
      });
    },
    /**
     * Get or set (and process) the search response. Called with no arguments to retrieve the
     * last response. Called with arguments to process the current response (called by
     * <code>search</code> on success or failure).
     *
     * In processing mode, this method triggers <code>simplicitySearchSearching</code>,
     * <code>simplicitySearchResponse</code> and <code>simplicitySearchResponseHandled</code> events, then calls
     * <code>facetCounts</code> and <code>resultSet</code>.
     *
     *
     * @param searchResponse
     *   The search response to process.
     * @param triggerEvent
     *   Optional parameter, set it to <code>false</code> to prevent triggering of events.
     *   Defaults to <code>true</code> if not specified.
     *
     * @example
     *   // Get the last search response
     *   var response = $('body').simplicityDiscoverySearch('searchResponse');
     *
     * @example
     *   // Process a fake search response for testing purposes
     *   var response = {
     *     // Fake response
     *   };
     *   $('body').simplicityDiscoverySearch('searchResponse', response);
     *
     * @name $.ui.simplicityDiscoverySearch.searchResponse
     * @function
     */
    searchResponse: function (searchResponse, triggerEvent) {
      if (arguments.length === 0) {
        return JSON.parse(this._searchResponse);
      }
      var discoveryResponse = searchResponse._discovery || {};
      var response = discoveryResponse.response || {};
      if (this.options.triggerFacetCountEvent) {
        searchResponse.drillDown = this.extractFacetCounts(response);
      }
      if (this.options.extractResultSet) {
        searchResponse.resultSet = this.extractResultSet(response);
      }
      this._searchResponse = JSON.stringify(searchResponse);
      if (triggerEvent !== false) {
        this.element.triggerHandler('simplicitySearchResponse',
          [JSON.parse(this._searchResponse)]);
      }
      if (this.options.triggerFacetCountEvent) {
        this.facetCounts(searchResponse.drillDown, triggerEvent);
      }
      if (this.options.triggerResultSetEvent && this.options.extractResultSet) {
        this.resultSet(searchResponse.resultSet, triggerEvent);
      }
      if (triggerEvent !== false) {
        this.element.triggerHandler('simplicitySearchResponseHandled');
      }
    },
    /**
     * Get the or set the facet counts. Called with no arguments for get behavior.
     * Triggers a <code>simplicityFacetCounts</code> event on set.
     *
     * @param facetCounts
     *   The facet counts to store.
     * @param triggerEvent
     *   Optional parameter, set it to <code>false</code> to prevent triggering of events.
     *   Defaults to <code>true</code> if not specified.
     *
     * @name $.ui.simplicityDiscoverySearch.facetCounts
     * @function
     */
    facetCounts: function (facetCounts, triggerEvent) {
      if (arguments.length === 0) {
        return JSON.parse(this._facetCounts);
      }
      this._facetCounts = JSON.stringify(facetCounts);
      if (triggerEvent !== false) {
        this.element.triggerHandler('simplicityFacetCounts', [JSON.parse(this._facetCounts)]);
      }
    },
    /**
     * Get the or set the resultset. Called with no arguments for get behavior.
     * Triggers a <code>simplicityResultSet</code> event on set.
     *
     * @param resultSet
     *   The resultset to store.
     * @param triggerEvent
     *   Optional parameter, set it to <code>false</code> to prevent triggering of events.
     *   Defaults to <code>true</code> if not specified.
     *
     * @name $.ui.simplicityDiscoverySearch.resultSet
     * @function
     */
    resultSet: function (resultSet, triggerEvent) {
      if (arguments.length === 0) {
        return JSON.parse(this._resultSet);
      }
      this._resultSet = JSON.stringify(resultSet);
      if (triggerEvent !== false) {
        this.element.triggerHandler('simplicityResultSet', [JSON.parse(this._resultSet)]);
      }
    },
    /**
     * Converts the search response to a facet counts object using
     * the drillDown response.
     *
     * @example
     *   Input
     *   {
     *     drillDown: [
     *       {
     *         dimension: shape,
     *         ids: ['a', 'b', 'c'],
     *         exactCounts: [1, 3, 4],
     *         fuzzyCounts: [2, 6, 8]
     *       }
     *     ]
     *   }
     *
     * @example
     *   Output
     *   {
     *     shape: {
     *       exact: {'a': 1, 'b': 3, 'c': 4},
     *       fuzzy: {'a': 2, 'b': 6, 'c': 8}
     *     }
     *   }
     *
     * @param discoveryResponse
     * @name $.ui.simplicityDiscoverySearch.extractFacetCounts
     * @function
     */
    extractFacetCounts: function (discoveryResponse) {
      var facetCounts = {};
      if ($.isArray(discoveryResponse.drillDown)) {
        $.each(discoveryResponse.drillDown, function (idx, elem) {
          var dimFacetCounts = facetCounts[elem.dimension] || {};
          facetCounts[elem.dimension] = dimFacetCounts;
          var exactCounts = dimFacetCounts.exact || {};
          dimFacetCounts.exact = exactCounts;
          var fuzzyCounts = dimFacetCounts.fuzzy || {};
          dimFacetCounts.fuzzy = fuzzyCounts;
          $.each(elem.ids, function (idx, id) {
            exactCounts[id] = elem.exactCounts[idx];
            fuzzyCounts[id] = elem.fuzzyCounts[idx];
          });
        });
      }
      return facetCounts;
    },
    /**
     * Converts the search response to a resultset object.
     * @example
     *   Input
     *   {
     *     startIndex: 0
     *     pageSize: 10,
     *     currentPageSize: 10,
     *     exactSize: 2,
     *     totalSize: 120,
     *     datasetSize: 55000,
     *     itemIds: ['a', 'b', 'c'],
     *     relevanceValues: [1.0, 1.0, 0.9],
     *     exactMatches: [true, true, false],
     *     properties: [
     *       {title: 'aaa'},
     *       {title: 'bbb'},
     *       {title: 'ccc'}
     *     ],
     *     highlighting: [
     *       {},
     *       {'title': '[b]bbb[/b]'},
     *       {}
     *     ]
     *   }
     *
     * @example
     *   Output
     *   <pre>
     *   {
     *     startIndex: 0,
     *     pageSize: 10,
     *     exactSize: 2,
     *     totalSize: 120,
     *     datasetSize: 55000,
     *     numRows: 10,
     *     rows: [
     *       {
     *         id: 'a',
     *         exact: true,
     *         score: 1.0
     *         properties: {
     *           title: 'aaa'
     *         },
     *         highlighting: {}
     *       },
     *       {
     *         id: 'b',
     *         exact: true,
     *         score: 1.0
     *         properties: {
     *           title: 'bbb'
     *         },
     *         highlighting: {
     *           title: '[b]bbb[/b]'
     *         }
     *       },
     *       {
     *         id: 'c',
     *         exact: false,
     *         score: 0.9
     *         properties: {
     *           title: 'ccc'
     *         },
     *         highlighting: {}
     *       }
     *     ]
     *   }
     *   </pre>
     *
     * @param discoveryResponse
     * @name $.ui.simplicityDiscoverySearch.extractResultSet
     * @function
     */
    extractResultSet: function (discoveryResponse) {
      var resultSet = {
        startIndex: discoveryResponse.startIndex || 0,
        pageSize: discoveryResponse.pageSize || 0,
        exactSize: discoveryResponse.exactSize || 0,
        totalSize: discoveryResponse.totalSize || 0,
        datasetSize: discoveryResponse.datasetSize || 0
      };
      var rows = [];
      if ('undefined' !== typeof discoveryResponse.itemIds) {
        var itemIds = discoveryResponse.itemIds;
        var exactMatches = discoveryResponse.exactMatches;
        var relevanceValues = discoveryResponse.relevanceValues;
        var properties = discoveryResponse.properties;
        var highlighting = discoveryResponse.highlighting;
        if (!$.isArray(properties)) {
          properties = null;
        }
        if (!$.isArray(highlighting)) {
          highlighting = null;
        }
        $.each(itemIds, function (idx, itemId) {
          row = {
            id: itemId,
            exact: exactMatches[idx],
            score: relevanceValues[idx]
          };
          if (properties !== null) {
            row.properties = properties[idx];
          }
          if (highlighting !== null) {
            row.highlighting = highlighting[idx];
          }
          rows.push(row);
        });
      }
      resultSet.numRows = rows.length;
      resultSet.rows = rows;
      return resultSet;
    },
    searchStats: function () {
      return this._ajaxHelper.getStats();
    }
  });
  $.fn.simplicityDiscoverySearchItemEnumerator = function (searchResponse, callback) {
    var discovery = searchResponse._discovery || {};
    var discoveryResponse = discovery.response || {};
    if ('undefined' !== typeof discoveryResponse.itemIds) {
      var startIndex = discoveryResponse.startIndex;
      var itemIds = discoveryResponse.itemIds;
      var exactMatches = discoveryResponse.exactMatches;
      var relevanceValues = discoveryResponse.relevanceValues;
      var properties = discoveryResponse.properties;
      var highlighting = discoveryResponse.highlighting;
      if (!$.isArray(properties)) {
        properties = null;
      }
      if (!$.isArray(highlighting)) {
        highlighting = null;
      }
      $.each(itemIds, function (idx, itemId) {
        row = {
          id: itemId,
          exact: exactMatches[idx],
          score: relevanceValues[idx],
          resultsIndex0: idx + startIndex,
          index0: idx,
          index1: idx + 1
        };
        if (properties !== null) {
          row.properties = properties[idx];
        }
        if (highlighting !== null) {
          row.highlighting = highlighting[idx];
        }
        callback(idx, row);
      });
    }
  };
}(jQuery));
