module("simplicityFacetCount");

test("span basics", function() {
  expect(6);
  
  var elem = $('<span>not a widget</span>').appendTo('#qunit-fixture');
  equal(elem.hasClass('ui-simplicity-facet-count'), false);
  equal(elem.text(), 'not a widget');
  
  elem.simplicityFacetCount({
    searchElement: '#qunit-fixture',
    facetId: 'myFacetId',
    facetsKey: 'myFacetsKey'
  });
  equal(elem.hasClass('ui-simplicity-facet-count'), true);
  equal(elem.text(), 'not a widget');
  
  $('#qunit-fixture').trigger('simplicitySearchResponse', {});
  equal(elem.text(), '?');

  $('#qunit-fixture').trigger('simplicitySearchResponse', {
    drillDown: {
      'myFacetsKey': {
        'exact': {
          'myFacetId': 23
        }
      }
    }
  });
  equal(elem.text(), '23');
});

test("option basics", function() {
  expect(6);
  
  var select = $('<select name="q"><option value="1">label</option></select>')
    .appendTo('#qunit-fixture');
  var option = select.find('option');
  equal(option.hasClass('ui-simplicity-facet-count'), false);
  equal(option.text(), 'label');
  
  option.simplicityFacetCount({
    searchElement: '#qunit-fixture',
    facetId: 'myFacetId',
    facetsKey: 'myFacetsKey'
  });
  equal(option.hasClass('ui-simplicity-facet-count'), true);
  equal(option.text(), 'label');
  
  $('#qunit-fixture').trigger('simplicitySearchResponse', {});
  equal(option.text(), 'label ?');

  $('#qunit-fixture').trigger('simplicitySearchResponse', {
    drillDown: {
      'myFacetsKey': {
        'exact': {
          'myFacetId': 23
        }
      }
    }
  });
  equal(option.text(), 'label 23');
});

test("span lifecycle", function() {
  expect(12);
  
  var elem1 = $('<span>not a widget</span>').appendTo('#qunit-fixture');
  var elem2 = $('<span>not a widget either</span>').appendTo('#qunit-fixture');
  $([elem1, elem2]).simplicityFacetCount({
    searchElement: '#qunit-fixture',
    facetId: 'myFacetId',
    facetsKey: 'myFacetsKey'
  });
  $('#qunit-fixture').trigger('simplicitySearchResponse', {
    drillDown: {
      'myFacetsKey': {
        'exact': {
          'myFacetId': 23
        }
      }
    }
  });
  equal(elem1.hasClass('ui-simplicity-facet-count'), true);
  equal(elem2.hasClass('ui-simplicity-facet-count'), true);
  equal(elem1.text(), '23');
  equal(elem2.text(), '23');
  
  elem2.remove();
  equal(elem1.hasClass('ui-simplicity-facet-count'), true);
  equal(elem2.hasClass('ui-simplicity-facet-count'), false);
  equal(elem1.text(), '23');
  equal(elem2.text(), '23');

  $('#qunit-fixture').trigger('simplicitySearchResponse', {
    drillDown: {
      'myFacetsKey': {
        'exact': {
          'myFacetId': 45
        }
      }
    }
  });
  equal(elem1.hasClass('ui-simplicity-facet-count'), true);
  equal(elem2.hasClass('ui-simplicity-facet-count'), false);
  equal(elem1.text(), '45', 'elem1 should still process events');
  equal(elem2.text(), '23', 'elem2 should no longer process events');
});

test("option lifecycle", function() {
  expect(12);
  
  var select = $('<select name="q"><option value="1">label</option><option value="2">other</option></select>')
    .appendTo('#qunit-fixture');
  var option1 = $(select.find('option')[0]);
  var option2 = $(select.find('option')[1]);
  $([option1, option2]).simplicityFacetCount({
    searchElement: '#qunit-fixture',
    facetId: 'myFacetId',
    facetsKey: 'myFacetsKey'
  });
  $('#qunit-fixture').trigger('simplicitySearchResponse', {
    drillDown: {
      'myFacetsKey': {
        'exact': {
          'myFacetId': 23
        }
      }
    }
  });
  equal(option1.hasClass('ui-simplicity-facet-count'), true);
  equal(option2.hasClass('ui-simplicity-facet-count'), true);
  equal(option1.text(), 'label 23');
  equal(option2.text(), 'other 23');
  
  option2.remove();
  equal(option1.hasClass('ui-simplicity-facet-count'), true);
  equal(option2.hasClass('ui-simplicity-facet-count'), false);
  equal(option1.text(), 'label 23');
  equal(option2.text(), 'other 23');

  $('#qunit-fixture').trigger('simplicitySearchResponse', {
    drillDown: {
      'myFacetsKey': {
        'exact': {
          'myFacetId': 45
        }
      }
    }
  });
  equal(option1.hasClass('ui-simplicity-facet-count'), true);
  equal(option2.hasClass('ui-simplicity-facet-count'), false);
  equal(option1.text(), 'label 45');
  equal(option2.text(), 'other 23');
});
