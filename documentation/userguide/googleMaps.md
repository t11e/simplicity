---
layout: default
nav: userguide
nav2: googleMaps
title: Google Maps
subhead: Google Maps
lead: You are here.
google_maps: true
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>Google Maps</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Exposes the mapping functionality from the
            <a href="https://developers.google.com/maps/documentation/javascript/reference">Google Maps JavaScript API V3</a>.
        </p>
        <p>
            Simplicity provides a set of widgets to help add maps to your pages.
            <dl>
                <dt>simplicityGoogleMap</dt>
                <dd>Wraps the Google Map object, used by the other Simplicity widgets.</dd>
                <dt>simplicityGoogleMapResults</dt>
                <dd>Adds a marker to the map for each item in the current page of search results.</dd>
                <dt>simplicityGoogleMapBoundsCoordinator</dt>
                <dd>Moves and scales the map to ensure all markers are visible.</dd>
                <dt>simplicityGoogleMapBoundsTracker</dt>
                <dd>Watches the map to expose its position as it is panned and zoomed.</dd>
                <dt>simplicityGoogleGeocoder</dt>
                <dd>Converts addresses to latitude/longitude using AJAX requests to Google.</dd>
            </dl>
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Adding Google Maps to the page</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To use a Google Map, you need to add the Google Maps <code>script</code> tag to the page. This is documented in the
            <a href="https://developers.google.com/maps/documentation/javascript/tutorial">Getting Started</a> section of the
            Developer's Guide over at Google.
        </p>
        <p>
            To summarize their fine documentation, add a single script tag to the page:
        </p>
{% highlight html %}
<script type="text/javascript"
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=SET_TO_TRUE_OR_FALSE">
</script>
{% endhighlight %}
        <p>
            The API key is optional but recommended and well documented in the
            <a href="https://developers.google.com/maps/documentation/javascript/tutorial">Getting Started</a> section of the
            Developer's Guide over at Google.
        </p>
        <p>
            Place the script tag at the bottom of the page, typically after the script tags that load jQuery and Simplicity.
            This way the rest of the Simplicity wigets can interact even if there are network delays loading the Google Maps API.
        </p>
{% highlight html %}
<html>
    <head>
        <link rel="stylesheet" href="path/to/simplicity.min.css">
    </head>
    <body>
        <div>
            <!-- page content goes here -->
        </div>
        <script src="path/to/jquery.min.js"></script>
        <script src="path/to/jquery-ui.min.js"></script>
        <script src="path/to/simplicity.min.js"></script>
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
    </body>
</html>
{% endhighlight %}
    </div>
</div>

<div class="page-header">
  <h1>simplicityGoogleMap</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            This widget acts as a container for the Google map object. It can automatically create a map or you can pass one
            in. Other simplicity widgets use this widget to locate the actual map object.
        </p>
    </div>
</div>

<div class="page-header">
  <h2>Automatic map creation</h2>
</div>
<div class="row">
    <div class="span8">
        <p>
            To create a map, first create a container <code>div</code>. Notice that we explicitly configure the width and height of
            this div. Failure to do so will result in a 0x0 map that is not visible.
        </p>
{% highlight html %}
<div id="example" style="width:400px; height:200px;"></div>
{% endhighlight %}
        <p>
            Then either create the map with the default options.
        </p>
{% highlight javascript %}
$('#example').simplicityGoogleMap();
{% endhighlight %}
        <p>
            Or pass in your own.
        </p>
{% highlight javascript %}
$('#example').simplicityGoogleMap({
    mapOptions: {
        center: new google.maps.LatLng(51.507, -0.128),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
});
{% endhighlight %}
        <p>
            You can then access the created map as you need to.
        </p>
{% highlight javascript %}
var map = $('#example').simplicityGoogleMap('map');
map.setZoom(2);
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="map1" class="map-example"> </div>
        <script type="text/javascript">
            $(function () {
                $('#map1').simplicityGoogleMap({
                    mapOptions: {
                        center: new google.maps.LatLng(51.507, -0.128),
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                });
            });
        </script>
    </div>
</div>

<div class="page-header">
  <h2>Manual map creation</h2>
</div>
<div class="row">
    <div class="span8">
        <p>
            To create a map, first create a holder <code>div</code>.
        </p>
{% highlight html %}
<div id="example" style="width:400px; height:200px;"></div>
{% endhighlight %}
        <p>
            Then create the map and pass it into the <code>simplicityGoogleMap</code> widget.
        </p>
{% highlight javascript %}
var map = new google.maps.Map($('#example')[0], {
    center: new google.maps.LatLng(40.748,-73.986),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
$('#example').simplicityGoogleMap({
    map: map
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="map2" class="map-example"> </div>
        <script type="text/javascript">
            $(function () {
                var map = new google.maps.Map($('#map2')[0], {
                    center: new google.maps.LatLng(40.748,-73.986),
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                $('#map2').simplicityGoogleMap({
                    map: map
                });
            });
        </script>
    </div>
</div>

<div class="page-header">
  <h1>simplicityGoogleMapResults</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Places markers on the map for the current page of search results.
        </p>
{% highlight javascript %}
$('#example')
    .simplicityGoogleMap()
    .simplicityGoogleMapResults();
});
{% endhighlight %}
        <p>
            By default, this widget will listen to search response from the <code>body</code> element and expect to find
            coordinates in the <code>latitude</code> and <code>longitude</code> properties of the search results. You can
            override these defaults by setting the <code>searchElement</code>, <code>latitudeField</code> and
            <code>longitudeField</code> options.
        </p>
        <p>
            The widget fires a <code>simplicitygooglemapresultsmarker</code> event which you can use to customize the
            generated map markers.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleGoogleMapResults">
            <label><span class="badge">1</span> map</label>
            <div class="map-example"> </div>
            <label><span class="badge">2</span> search response</label>
            <select name="response">
                <option value='{% capture value %}{"_discovery":{"response":{}}}{% endcapture %}{{ value | escape }}'>Empty</option>
                <option value='{% capture value %}{
  "_discovery": {
    "response": {
      "itemIds": ["a","b","c"],
      "exactMatches": [true,true,true],
      "relevanceValues": [1,1,1],
      "properties": [
        {"latitude":34, "longitude":-95},
        {"latitude":42, "longitude":-100},
        {"latitude":39, "longitude":-90}
      ],
      "startIndex": 0
    }
  }
}{% endcapture %}{{ value | escape }}'>Page 1</option>
                <option value='{% capture value %}{
  "_discovery": {
    "response": {
      "itemIds": ["d","e","f"],
      "exactMatches": [true,false,false],
      "relevanceValues": [1,0,0],
      "properties": [
        {"latitude":34, "longitude":-105},
        {"latitude":42, "longitude":-95},
        {"latitude":36, "longitude":-90}
      ],
      "startIndex": 0
    }
  }
}{% endcapture %}{{ value | escape }}'>Page 2</option>
            </select>
            <label><span class="badge">3</span> response details</label>
            <pre style="height: 8em; overflow: scroll;"></pre>
        </div>
        <script type="text/javascript">
            $(function() {
                $('#exampleGoogleMapResults .map-example')
                    .simplicityGoogleMap({
                        mapOptions: {
                            center: new google.maps.LatLng(39.436,-94.746),
                            zoom: 3,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        }
                    })
                    .simplicityGoogleMapResults({
                        searchElement: '#exampleGoogleMapResults',
                        markerType: 'google'
                    });
                $('#exampleGoogleMapResults pre').simplicityDocsJsonSelector({
                    selectElement: '#exampleGoogleMapResults select[name="response"]',
                    change: function (evt, json) {
                        $('#exampleGoogleMapResults').triggerHandler('simplicitySearchResponse', json);
                    }
                });
                $('#exampleGoogleMapResults select[name="response"]').change();
            });
        </script>
        <p>
            Select a sample search response from <span class="badge">2</span>, see the details in <span class="badge">3</span>
            and notice how the markers are updated in <span class="badge">1</span>.
        </p>
    </div>
</div>

<div class="page-header">
  <h2>simplicitygooglemapresultsmarker event</h2>
</div>
<div class="row">
    <div class="span8">
        <p>
            This event is triggered by <code>simplicityGoogleMapResults</code> whenever it creates a marker from a search
            result which is about to be added to the map. It gives you the opportunity to customize the marker before
            it is attached to the map or prevent it from being added.
        </p>
{% highlight javascript %}
$('#example').bind('simplicitygooglemapresultsmarker', function (evt, ui) {
    // Use different icons for exact and fuzzy matches.
    if (ui.row.exact) {
        ui.marker.setIcon('example/exact.png');
    } else {
        ui.marker.setIcon('example/fuzzy.png');
    }
});
{% endhighlight %}
        <p>
            The <code>ui</code> parameter to the event handler will be populated with an <code>Object</code> containing
            the following properties.
        </p>
        <dl>
            <dt>map</dt>
            <dd>The <a href="https://developers.google.com/maps/documentation/javascript/reference#Map">google.maps.Map</a> instance.</dd>
            <dt>marker</dt>
            <dd>The marker that has been created. Possibly a <a href="https://developers.google.com/maps/documentation/javascript/reference#Marker">google.maps.Marker</a>.</dd>
            <dt>row</dt>
            <dd>
                Metadata about the associated row in the search results. This is an <code>Object</code> containing
                the following properties.
                <dl>
                    <dt>id</dt>
                    <dd>The <code>id</code> of this search result.</dd>
                    <dt>exact</dt>
                    <dd><code>true</code> is this is an exact match, <code>false</code> otherwise</dd>
                    <dt>score</dt>
                    <dd>The floating point relevance score for this result.</dd>
                    <dt>resultsIndex0</dt>
                    <dd>
                        The 0-based position of this result in the entire result set. With a page size of 10, the first
                        result on the first page would have value of <code>0</code>,
                        and the first result on the second page would have a value of <code>10</code>.
                    </dd>
                    <dt>index0</dt>
                    <dd>
                        The 0-based position of this result within the current page. The first result will always have
                        a value of <code>0</code>.
                    </dd>
                    <dt>index1</dt>
                    <dd>
                        The 1-based position of this result within the current page. The first result will always have
                        a value of <code>1</code>.
                    </dd>
                    <dt>properties</dt>
                    <dd>
                        Optional property. When it exist it contains the properties for the current result as returned by
                        the Discovery Search Engine. For example <code>{"_id":"10","price":375000}</code>.
                    </dd>
                    <dt>highlighting</dt>
                    <dd>
                        Optional property. When it exist it contains the highlighting response for the current result as returned
                        by the Discovery Search Engine. For example <code>{"description":"This is a &lt;b&gt;great&lt;/b&gt; example"}</code>.
                    </dd>
                </dl>
            </dd>
        </dl>
    </div>
</div>

<div class="page-header">
  <h1>simplicityGoogleMapBoundsCoordinator</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Handles coordinating the visible map bounds between multiple widgets. Achieves this by firing a
            <code>simplicitygooglemapboundscoordinatorcalculatebounds</code> event which provides a vendor specific
            bounds object, listeners of this event are responsible for extending the bounds to include all the points
            they want to make visible. The <code>simplicityGoogleMapResults</code> widget automatically adds its markers to
            the bounds event.
        </p>
        <p>
            To use this widget, simply attach it to the same DOM element as the map.
        </p>
{% highlight javascript %}
$('#example')
    .simplicityGoogleMap()
    .simplicityGoogleMapBoundsCoordinator();
{% endhighlight %}
        <p>
            You can listen to the <code>simplicitygooglemapboundscoordinatorcalculatebounds</code> event like so.
        </p>
{% highlight javascript %}
$('#example').bind('simplicitygooglemapboundscoordinatorcalculatebounds', function (evt, ui) {
    // Ensure the following point is visible.
    ui.bounds.extend(new google.maps.LatLng(39.436,-94.746));
});
{% endhighlight %}
        <p>
            The <code>ui</code> parameter to the event handler will be populated with an <code>Object</code> containing
            the following properties.
        </p>
        <dl>
            <dt>bounds</dt>
            <dd>
                A <a href="https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds">google.maps.LatLngBounds</a>
                instance that you can modify.
            </dd>
        </dl>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleGoogleMapBoundsCoordinator">
            <label><span class="badge">1</span> map</label>
            <div class="map-example"> </div>
            <label><span class="badge">2</span> shapes</label>
            <ul>
                <li><label><input type="checkbox" name="shape" value="red"/> red</label></li>
                <li><label><input type="checkbox" name="shape" value="blue"/> blue</label></li>
                <li><label><input type="checkbox" name="shape" value="green"/> green</label></li>
            </ul>
            <label><span class="badge">3</span> <button name="updateBounds" class="btn">Update Bounds</button></label>
        </div>
        <script type="text/javascript">
            $(function() {
                var map = new google.maps.Map($('#exampleGoogleMapBoundsCoordinator .map-example')[0], {
                    center: new google.maps.LatLng(37.653, -122.245),
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var shapes = {
                    red: new google.maps.Polyline({
                        map: map,
                        strokeColor:'red',
                        path: [
                            new google.maps.LatLng(37.8011, -122.525),
                            new google.maps.LatLng(37.8271, -122.3575),
                            new google.maps.LatLng(37.6077, -122.3959),
                            new google.maps.LatLng(37.5968, -122.4866),
                            new google.maps.LatLng(37.8011, -122.525)
                        ]
                    }),
                    blue: new google.maps.Polyline({
                        map: map,
                        strokeColor:'blue',
                        path: [
                            new google.maps.LatLng(37.3811, -122.0663),
                            new google.maps.LatLng(37.4356, -121.8906),
                            new google.maps.LatLng(37.2391, -121.7285),
                            new google.maps.LatLng(37.2522, -121.8796),
                            new google.maps.LatLng(37.2719, -122.0279),
                            new google.maps.LatLng(37.3811, -122.0663)
                        ]
                    }),
                    green: new google.maps.Polyline({
                        map: map,
                        strokeColor:'green',
                        path: [
                            new google.maps.LatLng(37.8109, -122.3087),
                            new google.maps.LatLng(37.8293, -122.2723),
                            new google.maps.LatLng(37.7984, -122.2112),
                            new google.maps.LatLng(37.774, -122.2675),
                            new google.maps.LatLng(37.8109, -122.3087)
                        ]
                    })
                };
                $('#exampleGoogleMapBoundsCoordinator .map-example')
                    .simplicityGoogleMap({map:map})
                    .simplicityGoogleMapBoundsCoordinator();
                $('#exampleGoogleMapBoundsCoordinator .map-example').bind('simplicitygooglemapboundscoordinatorcalculatebounds', function (evt, ui) {
                    $('#exampleGoogleMapBoundsCoordinator input:checked').each(function (idx, elem) {
                        var shape = shapes[$(elem).attr('value')];
                        if ('undefined' !== typeof shape) {
                            $.each(shape.getPath().getArray(), function (idx, latLng) {
                                ui.bounds.extend(latLng);
                            });
                        }
                    });
                });
                $('#exampleGoogleMapBoundsCoordinator button').click(function () {
                    $('#exampleGoogleMapBoundsCoordinator .map-example').simplicityGoogleMapBoundsCoordinator('updateBounds');
                });
            });
        </script>
        <p>
            Choose which shapes you want to include in the bounds calculation from <span class="badge">2</span>,
            press <span class="badge">3</span> and notice how the map moves in <span class="badge">1</span>.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>simplicityGoogleMapBoundsTracker</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Gives access to the map bounds in normalized and vendor specific form. Triggers a
            <code>simplicitygooglemapboundstrackerbounds</code> event whenever the map is moved or zoomed.
        </p>
        <p>
            To use this widget, simply attach it to the same DOM element as the map.
        </p>
{% highlight javascript %}
$('#example')
    .simplicityGoogleMap()
    .simplicityGoogleMapBoundsTracker();
{% endhighlight %}
        <p>
            You can listen to the <code>simplicitygooglemapboundstrackerbounds</code> event like so.
        </p>
{% highlight javascript %}
$('#example').bind('simplicitygooglemapboundstrackerbounds', function (evt, ui) {
    // Do something with the bounds
    console.log('Map bounds:');
    console.log('    north', ui.bounds.north);
    console.log('    east ',  ui.bounds.east);
    console.log('    south', ui.bounds.south);
    console.log('    west ',  ui.bounds.west);
});
{% endhighlight %}
{% highlight text %}
Map bounds:
    north 38.03040444840505
    east  -121.706669921875
    south 37.38723293115014
    west  -123.025029296875
{% endhighlight %}
        <p>
            The <code>ui</code> parameter to the event handler will be populated with an <code>Object</code> containing
            the following properties.
        </p>
        <dl>
            <dt>bounds</dt>
            <dd>
                The bounding box of the map, as an <code>Object</code> containing the following properties.
                <dl>
                    <dt>vendor</dt>
                    <dd><a href="https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds">google.maps.LatLngBounds</a></dd>
                    <dt>north</dt>
                    <dd>The north most boundary of the bounding box. For example <code>43.22544272252788</code>.</dd>
                    <dt>east</dt>
                    <dd>The east most boundary of the bounding box. For example <code>-67.58411407470629</code>.</dd>
                    <dt>south</dt>
                    <dd>The south most boundary of the bounding box. For example <code>38.23413509208393</code>.</dd>
                    <dt>west</dt>
                    <dd>The west most boundary of the bounding box. For example <code>-82.96497344970629</code>.</dd>
                </dl>
            </dd>
            <dt>center</dt>
            <dd>
                The center point the map, as an <code>Object</code> containing the following properties.
                <dl>
                    <dt>vendor</dt>
                    <dd><a href="https://developers.google.com/maps/documentation/javascript/reference#LatLng">google.maps.LatLng</a></dd>
                    <dt>latitude</dt>
                    <dd>For example <code>43.22544272252788</code>.</dd>
                    <dt>longitude</dt>
                    <dd>For example <code>-67.58411407470629</code>.</dd>
                </dl>
            </dd>
        </dl>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleGoogleMapBoundsTracker">
            <label><span class="badge">1</span> map</label>
            <div class="map-example"> </div>
            <label><span class="badge">2</span> bounds</label>
            <label><input name="north" class="input-medium" /> north</label>
            <label><input name="east" class="input-medium" /> east</label>
            <label><input name="south" class="input-medium" /> south</label>
            <label><input name="west" class="input-medium" /> west</label>
        </div>
        <script type="text/javascript">
            $(function() {
                var map = new google.maps.Map($('#exampleGoogleMapBoundsTracker .map-example')[0], {
                    center: new google.maps.LatLng(37.653, -122.245),
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                $('#exampleGoogleMapBoundsTracker .map-example')
                    .simplicityGoogleMap({map:map})
                    .simplicityGoogleMapBoundsTracker();
                $('#exampleGoogleMapBoundsTracker .map-example').bind('simplicitygooglemapboundstrackerbounds', function (evt, ui) {
                    $('#exampleGoogleMapBoundsTracker input[name="north"]').val(ui.bounds.north);
                    $('#exampleGoogleMapBoundsTracker input[name="east"]').val(ui.bounds.east);
                    $('#exampleGoogleMapBoundsTracker input[name="south"]').val(ui.bounds.south);
                    $('#exampleGoogleMapBoundsTracker input[name="west"]').val(ui.bounds.west);
                });
            });
        </script>
        <p>
            Pan and zoom the map in <span class="badge">1</span> and notice how the bounds are updated in
            <span class="badge">2</span>.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>simplicityGoogleMapGeocoder</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Wraps a <a href="https://developers.google.com/maps/documentation/javascript/reference#Geocoder">google.maps.Geocoder</a>
            to provide geocoding services, converting addresses to latitude and longitude coordinates.
        </p>
        <p>
            To use this widget, simply attach it to a DOM element.
        </p>
{% highlight javascript %}
$('#example').simplicityGoogleGeocoder();
{% endhighlight %}
        <p>
            Then you can call the <code>geocode</code> method. Note that it takes two arguments, the first is
            the <a href="https://developers.google.com/maps/documentation/javascript/reference#GeocoderRequest">maps.google.GeocoderRequest</a>
            and the second a callback function that can handle the response once complete.
        </p>
{% highlight javascript %}
var request = {
    address: 'the whitehouse'
};
$('#example').simplicityGoogleGeocoder('geocode', request, function (response) {
    console.log('Geocoded:');
    console.log('    address:  ', response.items[0].value);
    console.log('    latitude: ', response.items[0].latitude);
    console.log('    longitude:', response.items[0].longitude);
});
{% endhighlight %}
{% highlight text %}
Geocoded:
    address:   The White House, President's Park, 1600 Pennsylvania Avenue Northwest, Washington, DC 20500, USA
    latitude:  38.89768309999999
    longitude: -77.03649719999999
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleGoogleGeocoder">
            <label><span class="badge">1</span> address</label>
            <input name="address" class="input-medium" value="mount rushmore" />
            <label><span class="badge">2</span> response</label>
            <textarea name="response" class="input-large" rows="10"> </textarea>
        </div>
        <script type="text/javascript">
            $(function() {
                $('#exampleGoogleGeocoder').simplicityGoogleGeocoder();
                $('#exampleGoogleGeocoder input').change(function (evt, ui) {
                    var request = {
                        address: $(evt.target).val()
                    };
                    $('#exampleGoogleGeocoder').simplicityGoogleGeocoder('geocode', request, function (response) {
                        $('#exampleGoogleGeocoder textarea').val(JSON.stringify(response, null, '  '));
                    });
                }).change();
            });
        </script>
        <p>
            Enter an address into <span class="badge">1</span>, press enter or click outside the <code>input</code> and
            view the geocoded response in <span class="badge">2</span>.
        </p>
    </div>
</div>

<div class="page-header">
  <h2>autocompleteSource</h2>
</div>
<div class="row">
    <div class="span8">
        <p>
            The <code>simplicityGoogleMapGeocode</code> widget can also act as a
            <a href="http://api.jqueryui.com/autocomplete/">jQuery UI autocomplete</a> source.
        </p>
        <p>
            To set this up.
        </p>
{% highlight html %}
<input name="address" />
{% endhighlight %}
{% highlight javascript %}
$('#example').simplicityGoogleGeocoder();
$('input').autocomplete({
    source: $('#example').simplicityGoogleGeocoder('autocompleteSource');
});
{% endhighlight %}
    <p>
        You could then listen for <code>autocompletechange</code> events to process the user's selection.
    </p>
{% highlight javascript %}
$('input').bind('autocompletechange', function (evt, ui) {
    // Process the selection
    console.log('ui', ui);
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleGoogleGeocoderAutocomplete">
            <label><span class="badge">1</span> address</label>
            <input name="address" class="input-medium" />
            <label><span class="badge">2</span> autocompletechange</label>
            <textarea name="response" class="input-large" rows="10"> </textarea>
        </div>
        <script type="text/javascript">
            $(function() {
                $('#exampleGoogleGeocoderAutocomplete').simplicityGoogleGeocoder();
                $('#exampleGoogleGeocoderAutocomplete input')
                    .autocomplete({
                        source:$('#exampleGoogleGeocoderAutocomplete').simplicityGoogleGeocoder('autocompleteSource')
                    })
                    .bind('autocompletechange', function (evt, ui) {
                        $('#exampleGoogleGeocoderAutocomplete textarea').val(JSON.stringify(ui, null, '  '))
                    });
            });
        </script>
        <p>
            Slowly type an address into <span class="badge">1</span>. Once you select an option and press enter or click
            outside of the <code>input</code>, the <code>autocompletechange</code> event's <code>ui</code> argument is placed into
            <span class="badge">2</span>.
        </p>
    </div>
</div>
