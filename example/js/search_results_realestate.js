(function (window) {
  window.search_results_realestate = function (element, searchResponse) {
    var response = searchResponse._discovery && searchResponse._discovery.response ? searchResponse._discovery.response : {};
    var results = $('<div class="result-set ui-widget"/>');
    if (response.itemIds) {
      $.each(response.itemIds, function (idx, itemId) {
        var exact = response.exactMatches[idx];
        //var score = response.relevanceValues[idx];
        var properties = response.properties[idx];
        var row = $('' +
          '<div class="result-row ui-widget-content ui-corner-all">' +
          '  <div class="info1">' +
          '    <span class="itemId"/>' +
          '    <span class="match"/>' +
          '    <span class="type"/>' +
          '  </div>' +
          '  <div class="info2">' +
          '    <span class="price"/>' +
          '    <span class="beds"/>' +
          '    <span class="baths"/>' +
          '  </div>' +
          '  <div class="info3">' +
          '    <span class="condition"/>' +
          '    <span class="style"/>' +
          '    <span class="zipcode"/>' +
          '  </div>' +
          '</div>')
          .attr('id', 'result-' + itemId)
          .addClass(exact ? 'ui-state-active' : 'ui-priority-secondary');
        row.find('.itemId').text(itemId);
        row.find('.match').text(exact ? 'exact' : 'close');
        row.find('.type').text(properties.type);
        row.find('.price').text('$' + (properties.type === 'sales' ? properties.price : properties.lease));
        row.find('.beds').text(properties.bedroom + ' BR');
        row.find('.baths').text(properties.bath + ' BA');
        row.find('.condition').text(properties.condition);
        row.find('.style').text(properties.style);
        row.find('.zipcode').text(properties.zipcode);
        results.append(row);
      });
    }
    element.html(results);
  };
}(window));