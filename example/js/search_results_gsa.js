(function (window) {
  window.search_results_gsa = function (element, searchResponse) {
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
          '    <div>Item Id: <span class="itemId"/> <span class="match"/></div>' +
          '    <div>Title: <span class="title"/></div>' +
          '  </div>' +
          '  <div class="info2">' +
          '    <div>Category: <span class="category"/></div>' +
          '    <div>Agency: <span class="agency"/></div>' +
          '    <div>Sub Agency: <span class="subagency"/></div>' +
          '  </div>' +
          '  <div class="info3">' +
          '    <div>Description: <span class="description"/></div>' +
          '    <div>Keywords: <span class="keywords"/></div>' +
          '    <div>Formats: <span class="formats_avail"/></div>' +
          '    <div>Privacy: <span class="privacy_and_confidentiality"/></div>' +
          '  </div>' +
          '</div>')
          .attr('id', 'result-' + itemId)
          .addClass(exact ? 'ui-state-active' : 'ui-priority-secondary');
        row.find('.itemId').text(itemId);
        row.find('.match').text(exact ? 'exact' : 'close');
        row.find('.title').html(properties.title);
        row.find('.category').html(properties.category_name);
        row.find('.agency').html(properties.agency_name);
        row.find('.subagency').html(properties.subagency_name);
        row.find('.description').html(properties.description);
        row.find('.keywords').html(properties.keywords);
        var formats_avail = '';
        $.each(['has_csv', 'has_xls', 'has_kml', 'has_pdf', 'has_rss', 'has_rdf', 'has_esri', 'has_map'], function (i, format) {
          if (properties[format] === '1') {
            formats_avail += format + ' ';
          }
        });
        row.find('.formats_avail').text(formats_avail);
        row.find('.privacy_and_confidentiality').text(properties.privacy_and_confidentiality);

        results.append(row);
      });
    }
    element.html(results);
  };
}(window));