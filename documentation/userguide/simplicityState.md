---
layout: default
nav: userguide
nav2: simplicityState
title: simplicityState
subhead: simplicityState
lead: Recording the question.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicityState</h1>
</div>

The `simplicityState` widget wraps a [JSON](http://www.json.org) representation of state which is typially used for driving search.

In the common case each page contains just one `simplicityState` widget bound to the `body` element.

To create an empty state.
{% highlight javascript %}
$('body').simplicityState();
{% endhighlight %}

To create a pre-populated state, you'd use the `initialState` option.
{% highlight javascript %}
$('body').simplicityState({
  example: 'this is my default state'
});
{% endhighlight %}

To obtain the current state.
{% highlight javascript %}
$('body').simplicityState('state');
{% endhighlight %}

To set the current state.
{% highlight javascript %}
$('body').simplicityState('state', {
  example: 'this is my new state'
});
{% endhighlight %}

To get notified when the state changes. Note that the widget uses [$.triggerHandler](http://api.jquery.com/triggerHandler/) to prevent event bubbling.
{% highlight javascript %}
$('body').bind('simplicityStateChange', function (state) {
  console.log('state changed to', state);
});
{% endhighlight %}
