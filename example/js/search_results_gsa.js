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
          '    <label>Item Id: <span class="itemId"/> <span class="match"/></label>' +
          '    <label>Title: <span class="title"/></label>' +
          '  </div>' +
          '  <div class="info2">' +
          '    <label>Category: <span class="category"/></label>' +
          '    <label>Agency: <span class="agency"/></label>' +
          '    <label>Sub Agency: <span class="subagency"/></label>' +
          '  </div>' +
          '  <div class="info3">' +
          '    <label>Description: <span class="description"/></label>' +
          '    <label>Keywords: <span class="keywords"/></label>' +
          '    <label>Formats: <span class="formats_avail"/></label>' +
          '    <label>Privacy: <span class="privacy_and_confidentiality"/></label>' +
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