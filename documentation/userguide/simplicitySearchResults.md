---
layout: default
nav: userguide
nav2: simplicitySearchResults
title: simplicitySearchResults
subhead: simplicitySearchResults
lead: Displaying the best hits.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicitySearchResults</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            This widget is responsible for displaying the results of a search on
            the page.
        </p>
        <p>
            You can either use server side rendering and provide HTML in the
            response of the search controller or JavaScript templating to
            generate the results in the browser.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Server side rendering</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            The most common approach is to use server side rendering, this makes
            it the responsibility of the server side search controller to
            generate the HTML used to display search results. The generated HTML
            is returned as a JSON string value inside the regular JSON response
            from the search controller. The widget then just needs to splice it
            into the page.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="searchResults"></div>
{% endhighlight %}
        <h3>JavaScript</h3>
{% highlight javascript %}
$('#searchResults').simplicitySearchResults();
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="serverSideExample">
            <label><span class="badge">1</span> choose response</label>
            <select name="response" class="input-medium">
                <option value='{% capture value %}{
  "resultsHtml": "<ol><li>First</li><li>Second</li><li>Third</li></ol>"
}{% endcapture %}{{ value | escape }}'>list</option>
                <option value='{% capture value %}{
  "resultsHtml": "<div class=\"items\"><div class=\"item\">First</div><div class=\"item\">Second</div><div class=\"item\">Third</div></div>"
}{% endcapture %}{{ value | escape }}'>divs</option>
                <option value='{% capture value %}{
  "error": true,
  "status": 500,
  "statusText": "Example error",
  "message": "example error message goes here"
}{% endcapture %}{{ value | escape }}'>error</option>
            </select>
            <label><span class="badge">2</span> response details</label>
            <pre style="height: 8em; overflow: scroll;"> </pre>
            <label><span class="badge">3</span> results</label>
            <div class="well"> </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#serverSideExample div:last').simplicitySearchResults({
                    searchElement: '#serverSideExample'
                });
                $('#serverSideExample pre').simplicityDocsJsonSelector({
                    selectElement: '#serverSideExample select',
                    change: function (evt, json) {
                        $('#serverSideExample').triggerHandler('simplicitySearchResponse', json);
                    }
                });
                $('#serverSideExample select').change();
            });
        </script>
        <p>
            Choose a response from <span class="badge">1</span> and see the
            actual response detail at <span class="badge">2</span>. The
            <code>simplicitySearchResults</code> widget renders the
            <code>resultsHtml</code> in <span class="badge">3</span>.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Browser based rendering</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            You can take advantage of the browser to control the rendering of
            search results by converting the JSON response from the search
            controller to HTML with JavaScript. In this scenario the search
            controller does <strong>not</strong> have to return a
            <code>resultsHtml</code> field.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="searchResults"></div>
{% endhighlight %}
        <h3>JavaScript</h3>
{% highlight javascript %}
$('#searchResults').simplicitySearchResults({
    resultsCallback: function (target, searchResponse) {
        // Example to that puts the name of each result item in a div
        $.each(searchResponse._discovery.response.properties, function (idx, props) {
          $('<div/>')
            .attr('title', props._id)
            .text(props.name)
            .appendTo(target);
        });
    }
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
{% capture searchResponse %}
{
    "_discovery": {
        "response": {
            "properties": [
                {"_id":1, "name":"first"},
                {"_id":2, "name":"second"},
                {"_id":3, "name":"third"}
            ]
        }
    }
}
{% endcapture %}
{% capture resultsCallbackDivs %}
function (target, searchResponse) {
    target.children().remove();
    $.each(searchResponse._discovery.response.properties, function (idx, props) {
      $('<div/>')
        .attr('title', props._id)
        .text(props.name)
        .appendTo(target);
    });
}
{% endcapture %}
{% capture resultsCallbackList %}
function (target, searchResponse) {
    var list = $('<ol/>');
    $.each(searchResponse._discovery.response.properties, function (idx, props) {
      $('<li/>')
        .text(props.name)
        .appendTo(list);
    });
    target.html(list);
}
{% endcapture %}
{% capture resultsCallbackLabels %}
function (target, searchResponse) {
    target.children().remove();
    $.each(searchResponse._discovery.response.properties, function (idx, props) {
      $("<span class='label'/>")
        .text(props.name)
        .appendTo(target);
    });
}
{% endcapture %}
        <style>
        #browserBasedResults .label {
            padding: 0.2em;
            margin: 0.4em;
        }
        #browserBasedExample .searchResponse pre {
            height: 12em;
            overflow: scroll;
        }
        </style>
        <div id="browserBasedExample">
            <label><span class="badge">1</span> search response</label>
            <div class='searchResponse'>
{% highlight javascript %}
{{searchResponse}}
{% endhighlight %}
            </div>
            <label><span class="badge">2</span> choose resultsCallback</label>
            <select>
                <option>list</option>
                <option>divs</option>
                <option>labels</option>
            </select>
            <label><span class="badge">3</span> resultsCallBack implementation</label>
            <div id="resultCallbacks">
                <div id="resultsCallback-divs" class="resultsCallback ui-helper-hidden">
{% highlight javascript %}
{{resultsCallbackDivs}}
{% endhighlight %}
                </div>
                <div id="resultsCallback-list" class="resultsCallback ui-helper-hidden">
{% highlight javascript %}
{{resultsCallbackList}}
{% endhighlight %}
                </div>
                <div id="resultsCallback-labels" class="resultsCallback ui-helper-hidden">
{% highlight javascript %}
{{resultsCallbackLabels}}
{% endhighlight %}
                </div>
            </div>
            <label><span class="badge">4</span> results</label>
            <div id="browserBasedResults" class="well"> </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#browserBasedExample').simplicityDiscoverySearch({
                    initialSearchResponse: {{searchResponse}}
                });
                $('#browserBasedResults').simplicitySearchResults({
                    searchElement: '#browserBasedExample'
                });
                var resultsCallbacks = {
                    'divs': {{resultsCallbackDivs}},
                    'list': {{resultsCallbackList}},
                    'labels': {{resultsCallbackLabels}}
                };
                $('#browserBasedExample select:first')
                    .change(function (evt) {
                        var val = $(evt.target).val();
                        var resultsCallback = resultsCallbacks[val];
                        $('#resultCallbacks .resultsCallback').hide();
                        $('#resultsCallback-' + val).show();
                        $('#browserBasedResults').simplicitySearchResults('option', 'resultsCallback', resultsCallback);
                    })
                    .change();
            });
        </script>
        <p>
            The search response used for this example is displayed in
            <span class="badge">1</span>. You can select a
            <code>resultsCallback</code> function from
            <span class="badge">2</span>, see it's definition in
            <span class="badge">3</span> and it is applied to the
            <code>simplicitySearchResults</code> widget on
            <span class="badge">4</span>.
        </p>
    </div>
</div>
