(function (window) {
  window.search_controller_gsa = function (state) {
    var pageSize = state.pageSize || 5;
    var request = {
      criteria: [],
      properties: [],
      facets: {
        data_category_type_id: {includeLabel: true},
        agency: {minCount: 1, includeLabel: true, depth: 1, sortBy: 'labelAsc'},
        formats_avail: {minCount: 1},
        privacy: {dimension: 'privacy_and_confidentiality'}
      },
      highlighting: {
        template: ['<span class="ui-state-highlight">', '</span>']
      },
      pageSize: pageSize,
      startIndex: state.page ? (pageSize * (state.page - 1)) : 0
    };
    if (state.category_type) {
      request.criteria.push({
        dimension: 'data_category_type_id',
        value: state.category_type
      });
    }
    if (state.dataset_freetext) {
      request.criteria.push({
        dimension: 'freetext',
        value: state.dataset_freetext,
        cull: true,
        fieldBoosts: {
          title: 1.1,
          keywords: 0.9
        }
      });
    }
    if (state.formats_avail) {
      request.criteria.push({
        dimension: 'formats_avail',
        id: state.formats_avail
      });
    }
    if (state.agency) {
      request.criteria.push({
        dimension: 'agency',
        id: state.agency
      });
    }
    if (state.privacy) {
      request.criteria.push({
        dimension: 'privacy_and_confidentiality',
        id: state.privacy
      });
    }
    if (request.criteria.length === 0) {
      // No search parameters we used, apply a default search
      request.criteria.push({dimension: "data_category_type_id"});
    }
    return request;
  };
}(window));