module("simplicityDiscoverySearch");

test("default initial response", function() {
  expect(1);
  $('#state').simplicityState();
  $('#search').simplicityDiscoverySearch({
    stateElement: '#state'
  });
  deepEqual(
    $('#search').simplicityDiscoverySearch('searchResponse'),
    {
      "resultSet": {
        "startIndex": 0,
        "pageSize": 0,
        "exactSize": 0,
        "totalSize": 0,
        "datasetSize": 0,
        "numRows": 0,
        "rows": []
      }
    },
    'searchResponse');
});

test("dumb initial response response, default options", function() {
  expect(1);
  $('#state').simplicityState();
  $('#search').simplicityDiscoverySearch({
    stateElement: '#state',
    initialSearchResponse: {
      example: 'test'
    }
  });
  deepEqual(
    $('#search').simplicityDiscoverySearch('searchResponse'),
    {
      "example": "test",
      "resultSet": {
        "startIndex": 0,
        "pageSize": 0,
        "exactSize": 0,
        "totalSize": 0,
        "datasetSize": 0,
        "numRows": 0,
        "rows": []
      }
    },
    'searchResponse');
});

test("realistic initial response response, default options", function() {
  expect(1);
  $('#state').simplicityState();
  $('#search').simplicityDiscoverySearch({
    stateElement: '#state',
    initialSearchResponse: {
      _discovery: {
        request: {
          'dummy': 'request'
        },
        response: {
          itemIds: ['a', 'b', 'c'],
          exactMatches: [true, true, false],
          relevanceValues: [1.0, 0.9, 0.8],
          properties: [
            {name:'alpha'},
            {name:'bravo'},
            {name:'charlie'}
          ]
        }
      }
    }
  });
  deepEqual(
    $('#search').simplicityDiscoverySearch('searchResponse'),
    {
      "_discovery": {
        "request": {
          "dummy": "request"
        },
        "response": {
          "itemIds": ["a","b","c"],
          "exactMatches": [true,true,false],
          "relevanceValues": [1,0.9,0.8],
          "properties": [
            {"name": "alpha"},
            {"name": "bravo"},
            {"name": "charlie"}
          ]
        }
      },
      "resultSet": {
        "startIndex": 0,
        "pageSize": 0,
        "exactSize": 0,
        "totalSize": 0,
        "datasetSize": 0,
        "numRows": 3,
        "rows": [
          {
            "id": "a",
            "exact": true,
            "score": 1,
            "properties": {
              "name": "alpha"
            }
          },
          {
            "id": "b",
            "exact": true,
            "score": 0.9,
            "properties": {
              "name": "bravo"
            }
          },
          {
            "id": "c",
            "exact": false,
            "score": 0.8,
            "properties": {
              "name": "charlie"
            }
          }
        ]
      }
    },
    'searchResponse');
});
