(function (window) {
  window.search_controller_realestate = function (state) {
    var pageSize = state.pageSize || 5;
    var request = {
      criteria: [],
      properties: [],
      facets: {
        type: {},
        condition: {},
        bedroom: {},
        style: {
          navigable: false,
          dataIds: [
            'multi-family', 'apartment', 'condo', 'co-op', 'townhome',
            'single-family', 'colonial', 'classical', 'victorian', 'contemporary'
          ]
        }
      },
      pageSize: pageSize,
      startIndex: state.page ? (pageSize * (state.page - 1)) : 0
    };
    if (state.type) {
      request.criteria.push({
        dimension: 'type',
        id: state.type
      });
    }
    if (state.condition) {
      request.criteria.push({
        dimension: 'condition',
        id: state.condition
      });
    }
    if (state.bed) {
      request.criteria.push({
        dimension: 'bedroom',
        value: state.bed
      });
    }
    if (state.bath) {
      request.criteria.push({
        dimension: 'bath',
        value: state.bath
      });
    }
    if (state.priceMin || state.priceMax) {
      request.criteria.push({
        dimension: 'price',
        value: '[' + (state.priceMin ? state.priceMin : '?') +
          ',' + (state.priceMax ? state.priceMax : '?') + ']'
      });
    }
    if (state.leaseMin || state.leaseMax) {
      request.criteria.push({
        dimension: 'lease',
        value: '[' + (state.leaseMin ? state.leaseMin : '?') +
          ',' + (state.leaseMax ? state.leaseMax : '?') + ']'
      });
    }
    if (state.style) {
      request.criteria.push({
        dimension: 'style',
        id: state.style
      });
    }
    if ('n' in state && 'e' in state && 's' in state && 'w' in state) {
      request.criteria.push({
        dimension: 'location',
        shapes: [
          {
            latitude:  [state.n, state.n, state.s, state.s, state.n],
            longitude: [state.e, state.w, state.w, state.e, state.e]
          }
        ]
      });
    }
    if ('lat' in state && 'lon' in state) {
      request.criteria.push({
        dimension: 'location',
        latitude: state.lat,
        longitude: state.lon,
        exactDistance: 0.5
      });
    }
    if (request.criteria.length === 0) {
      // No search specified, provide a default
      request.criteria.push({
        dimension: 'type'
      });
    }
    return request;
  };
}(window));