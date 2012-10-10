---
layout: default
nav: userguide
nav2: simplicityDiscoverySearch
title: simplicityDiscoverySearch
subhead: simplicityDiscoverySearch
lead: Setting up the search flow.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicityDiscoverySearch</h1>
</div>

The `simplicityDiscoverySearch` widget coordinates with the `simplicityState`
widget to perform the Ajax search. By default, whenever the state changes
a search is performed.

<div class="page-header">
  <h1>Setup</h1>
</div>

Pages have a snippet of JavaScript at the end of their `body` that configures
the search.

The minimal block would be:
{% highlight javascript linenos %}
$('body').simplicityDiscoverySearch({
  url: '/my_search_controller.php'
});
{% endhighlight %}

Where as a more typical block is:
{% highlight javascript linenos %}
$('body')
  .simplicityState('mergeQueryParams')
  .simplicityHistory()
  .simplicityState('triggerChangeEvent')
  .simplicityPageSnapBack()
  .simplicityDiscoverySearch({
    url: '/my_search_controller.php'
  })
  .simplicityDiscoverySearch('search');
{% endhighlight %}

This enables several optional features, let's run through each line.

1. We bind all the page level widgets to the `body` element (our default
   location).
2. `simplicityState('mergerQueryParams')` consumes parameters from the query
   string portion of the URL and applies them to the state. Concretely,
   the URL `http://example.com/search?example=hello+world&category=3`
   would create the state `{"example": "hello world", "category": "3"}`.
3. `simplicityHistory()` enables the history plugin that uses the hash fragment
   of the URL to support browser back/forward buttons and to allow for
   bookmarking of the Ajax search state. Concretely, the URL
   `http://example.com/search#!example=hello+world&category=3` would create the
   state `{"example": "hello world", "category": "3"}` and the URL would be
   updated whenever the state is changed.
4. `simplicityState('triggerChangeEvent')` causes the current state to be
   applied to all widgets by firing a `simplicityStateChange` event. The order
   of this in relation to the `mergeQueryParams` and `simplicityHistory` widget
   is important.
5. `simplicityPageSnapBack()` watches the state and flips the page parameter
   whenever the other search parameters change.
6. `simplicityDiscoverySearch({...})` is the only mandatory line to make
   search work. By default it will trigger a search whenever the state changes
   and it's minimum configuration describes how it should communicate with the
   search service. This is described in more detail in the next section of
   this page.
7. `simplicityDiscoverySearch('search')` triggers an immediate search, useful
   for when you are not doing any server side search as part of generating
   the page.

<div class="page-header">
  <h1>Search Service</h1>
</div>

The `simplicityDiscoverySearch` widget can perform Ajax search requests in a two different ways:
1. directly to the Discovery Search Engine (via CORS), or
1. to a same-origin server-side search controller

You'll typically use direct engine searches for development purposes, and a server side search controller for a production site.

<div class="page-header">
  <h1>Server side search controller</h1>
</div>

{% highlight javascript %}
$('body').simplicityDiscoverySearch({
    url: '/my_search_controller.php'
});
{% endhighlight %}

Will make GET requests to the my_search_controller.php using the state as query parameters, and expect to receive a JSON document in our standard response format.

Concretely, the state:

{% highlight javascript %}
{
    "text": "this is an example"
}
{% endhighlight %}

Would be mapped to the URL:

    http://example.com/my_search_controller.php?text=this+is+an+example

The server side search controller would build a Discovery Request from the query parameters, dispatch it to the Discovery Search Engine and then return a JSON document that fits this template:

{% highlight javascript %}
{
  "_discovery": {
    "request": {
      // Original, unmodified Discovery Request
    },
    "response": {
      // Original, unmodified Discovery Response
    }
  },
  "resultsHtml": "Rendered results go here"
}
{% endhighlight %}

The widgets would then process the response to insert the results directly into the page and update any facets, maps or other dynamic details as appropriate.

<div class="page-header">
  <h1>JavaScript search controller with direct engine query</h1>
</div>

{% highlight javascript %}
var my_search_controller = function (state) {
    var discoveryRequest = {
        criteria: [],
        pageSize: 10
    };
    if (state.text) {
        discoveryRequest.criteria.push({
            dimension: 'text',
            value: state.text
        });
    }
    return discoveryRequest;
};
$('body').simplicityDiscoverySearch({
    url: 'http://example.com:8090/ws/query',
    backend: 'engine',
    controllerCallback: my_search_controller
});
{% endhighlight %}

This makes a direct POST request to the engine and uses the JavaScript function `my_search_controller` to create the Discovery Request from the state.
You'll need a [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) compatible browser to avoid any cross-origin sand-boxing issues.

<div class="page-header">
  <h1>Live search</h1>
</div>

By default a search is triggered whenever the state changes. We call this "live
search". If you prefer to have the end user click on a button to trigger the
search then you can set the `searchOnStateChange` option to `false` and
manually call the `search` method on the `simplicityDiscoverySearch` widget
from your click handler.

{% highlight javascript %}
$('body').simplicityDiscoverySearch({
    url: '/my_search_controller.php',
    searchOnStateChange: false
});
$('#searchButton').click(function () {
  $('body').simplicityDiscoverySearch('search');
});
{% endhighlight %}

<div class="page-header">
  <h1>Initial server side search</h1>
</div>

If you'd like to SEO optimize your page, you can perform the first search
when generating the HTML and splice that into the widget configuration.

To do so, you'd need to inject the state and search JSON objects into the
generated page.

{% highlight javascript %}
var injectedState = {
  "example": "my search string"
};
var injectedSearch = {
  "_discovery": {
    "request": {
      // Original Discovery request goes here
    },
    "response": {
      // Original Discovery response goes here
    }
  }
};

$('body').simplicityState({
    initialState: injectedState;
});
$('#searchNav :input').simplicityInputs();
$('body').simplicityState('triggerChangeEvent');

$('body').simplicityDiscoverySearch({
    url: '/my_search_controller.php',
    initialSearchResponse: injectedSearch;
});
{% endhighlight %}

<div class="page-header">
  <h1>Programmatic search</h1>
</div>

At any point you can call the `search` method of `simplicityDiscoverySearch` to
trigger a search.

To search using the current state:
{% highlight javascript %}
$('body').simplicityDiscoverySearch('search');
{% endhighlight %}

To ignore the current state and force a particular search:
{% highlight javascript %}
$('body').simplicityDiscoverySearch('search', {
  'example': 'custom overriden search'
});
{% endhighlight %}

<div class="page-header">
  <h1>Search Response</h1>
</div>

The current search response is buffered allowing you access it at any time.

{% highlight javascript %}
$('body').simplicityDiscoverySearch('searchResponse');
{% endhighlight %}

This returns a JSON compatible object that should follow our standard template.
Actual contents vary depending on the search controller implementation.

{% highlight javascript %}
{
  "_discovery": {
    "request": {
      // Original, unmodified Discovery Request
    },
    "response": {
      // Original, unmodified Discovery Response
    }
  },
  "resultsHtml": "Rendered results go here"
}
{% endhighlight %}
