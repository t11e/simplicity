$('body')
  .simplicityState('mergeQueryParams')
  .simplicityHistory()
  .simplicityState('triggerChangeEvent')
  .simplicityPageSnapBack()
  .simplicityDiscoverySearch({
    url: 'http://gsa.discoverysearchengine.com:8090/ws/query',
    backend: 'engine',
    controllerCallback: window.search_controller_gsa,
  })
  .simplicityDiscoverySearch('search');
