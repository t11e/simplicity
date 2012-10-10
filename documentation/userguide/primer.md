---
layout: default
nav: userguide
nav2: primer
title: Primer
subhead: Primer
lead: Standing on the shoulders of $.giants.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>Primer</h1>
</div>

Here we'll show you the common idiums of the upstream projects that the widgets
depend upon.

<div class="page-header">
  <h1>jQuery</h1>
</div>

External documentation:
* [jQuery Website](http://jquery.com/)
* [jQuery Documentation](http://docs.jquery.com/)

<h2>Selectors</h2>

Several Simplicity Widgets take a selector as an option. They always wrap the
passed in object with [$(selector)](http://api.jquery.com/jQuery/#jQuery1) meaning that
you can pass in a DOM element, jQuery object or CSS selector.

In this example, all of the options refer to the same target element.
{% highlight javascript %}
$('#example').selectorExample({
   domElement: document.getElementById('target'),
   jQueryObject: $('#target'),
   cssSelector: '#target' 
});
{% endhighlight %}

<h2>Deferred execution</h2>

We recommend setting up any JavaScript on the page to execute when the DOM
is ready using [$(callback)](http://api.jquery.com/jQuery/#jQuery3). This
prevents strange JavaScript errors, allows you to better optimize for
page load and gives you a functional closure that prevents leaking local
variables into the global scope.

{% highlight javascript %}
$(function () {
    // My code goes in here
    $('#example').text('hello, world');
});
{% endhighlight %}


<div class="page-header">
  <h1>jQuery UI</h1>
</div>

External documentation:
* [jQuery UI Website](http://jqueryui.com/)
* [jQuery UI Documentation](http://jqueryui.com/demos/)
* [jQuery UI Theming Overview](http://jqueryui.com/docs/Theming)
* [jQuery UI CSS Framework](http://jqueryui.com/docs/Theming/API)

The Simplicity Widgets all follow the standard jQuery UI Widget model.

<h2>Creating widgets</h2>
You can construct them with their default options:
{% highlight javascript %}
$('#example').exampleWidget();
{% endhighlight %}

Or override just the options you care about:
{% highlight javascript %}
$('#example').exampleWidget({
    name: 'example',
    rating: 0.9
});
{% endhighlight %}

And you can create more than one at a time:
{% highlight javascript %}
$('.example').exampleWidget()
{% endhighlight %}

<h2>Widget options and methods</h2>

Once created, you get get the value of any option:
{% highlight javascript %}
$('#example').exampleWidget('option', 'name');
{% endhighlight %}

Or set it:
{% highlight javascript %}
$('#example').exampleWidget('option', 'name', 'my new name');
{% endhighlight %}

You can even call methods on a widget:
{% highlight javascript %}
$('#example').exampleWidget('bounce');
{% endhighlight %}

<h2>Widget events</h2>

Let's presume that our widget is documented to fire a `bouncing` event.

We can bind an event handler at widget creation time:
{% highlight javascript %}
$('#example').exampleWidget({
    bouncing: function (evt, ui) {
        console.log('widget is bouncing', evt, ui);
    }
});
{% endhighlight %}

Or we can explicity bind an event handler for the fully qualified event name:
{% highlight javascript %}
$('#example').bind('examplewidgetbouncing', function (evt, ui) {
    console.log('widget is bouncing', evt, ui);
});
{% endhighlight %}

This highlights a subtle but important feature of jQuery UI. When binding to
a widget event using an option, you use the short version of the event name.
When binding to a widget event using `$.bind()` you use the long version of the
event name. To generate the long version of the event name, you lowercase the
name of the widget and then append the short event name. In our example above,
the short event name is `bouncing` while the long event name is
`examplewidgetbouncing`.

Technically, this is handled by the widget factory's use of the
`widgetEventPrefix` option. The
[jQuery UI slider](http://docs.jquery.com/UI/Slider#events) is a great example
of customizing this as it sets `widgetEventPrefix` to `slide` instead of the
default `slider` causing the events to be named `slidestart`, `slideslide`,
`slidechange` and `slidestop` instead of `sliderstart`, `sliderslide`,
`sliderchange` and `sliderstop`.

<h2>Simplicity Widget events</h2>

With the exception of `simplicityState` and `simplicityDiscoverySearch`,
all the Simplicity Widgets fire regular jQuery widget events that follow the
prefixing rules described above. These are regular DOM events that bubble up the
document.

The `simplicityState` and `simplicityDiscoverySearch` widgets use
[$.triggerHandler()](http://api.jquery.com/triggerHandler/) instead to create
non-prefixed non-bubbling events.

This allows us to take advantage of
[widget groups](/userguide/widgetgroups.html) without having to prevent events
from bubbling into the wrong group.

HTML
{% highlight html %}
<body>
    <div id="searchNav">...</div>
    <div id="secondarySearch">...</div>
</body>
{% endhighlight %}

JavaScript
{% highlight javascript %}
$('body')
    .simplicityState()
    .simplicityDiscoverySearch({
        url: '/my_search_controller.php'
    });

$('#secondarySearch')
    .simplicityState()
    .simplicityDiscoverySearch({
        stateElement: '#secondarySearch',
        url: '/my_search_controller.php'
    });

$('body').bind('simplicitySearchResponse', function (evt, searchResponse) {
    console.log('body search response', searchResponse);
});
$('#secondarySearch').bind('simplicitySearchResponse', function (evt, searchResponse) {
    console.log('secondary search response', searchResponse);
});
{% endhighlight %}

The use of `$.triggerHandler` means that the `simplicitySearchResponse` event
triggered from `#secondarySearch` will not be picked up by the event handler
that is bound to `body`.

<h2>CSS</h2>

jQuery UI widgets all set
[standard CSS classes](http://jqueryui.com/docs/Theming/API) on their attached
elements, at a minimum every widget's element has the class `ui-widget`.

The Simplicity Widgets additionally add a class to their element based on
the name of the widget. As a rule of thumb, the widget name is lower cased and
hyphens are inserted wherever a case change took place. There are a few
exceptions, so check the [API documentation](/jsdoc/) when in doubt.

For example:
<table class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>widget</th>
            <th>css class</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>simplicityState</td>
            <td>ui-simplicity-state</td>
        </tr>
        <tr>
            <td>simplicityFancySelect</td>
            <td>ui-simplicity-fancy-select</td>
        </tr>
        <tr>
            <td>simplicityMapQuestMapBoundsCoordinator</td>
            <td>ui-simplicity-mapquest-map-bounds-coordinator</td>
        </tr>
    </tbody>
</table>

<h2>Themes</h2>

jQuery UI has great support for [theming](http://jqueryui.com/docs/Theming) and
the Simplicity Widgets make use of the standard jQuery UI CSS classes to take
advantage of the current theme.

You can use [ThemeRoller](http://jqueryui.com/docs/Theming/Themeroller) to
download one of the standard themes or create your own.

At development time, it is often useful to drop the
[Theme Switcher Widget](http://jqueryui.com/docs/Theming/ThemeSwitcher) onto
a page so you can change the theme on the fly.
