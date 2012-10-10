---
layout: default
nav: userguide
nav2: simplicityFancySelect
title: simplicityFancySelect
subhead: simplicityFancySelect
lead: Unrolling the options.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicityFancySelect</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To enhance a <code>&lt;select></code> by applying a HTML template to
            it, first create the select and a target <code>div</code>.
        </p>
{% highlight html %}
<div id="example">
    <select name="example">
        <option value="">Any...</option>
        <option value="1" data-count="3">First</option>
        <option value="2" data-count="11">Second</option>
        <option value="3" data-count="6">Third</option>
    </select>
    <div></div>
</div>
{% endhighlight %}
        <p>Then apply the <code>simplicityFancySelect</code> widget to it.</p>
{% highlight javascript %}
$('#example div').simplicityFancySelect({
    select: '#example select'
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFancySelect1" class="well">
            <label><span class="badge">1</span> select</label>
            <select name="example">
                <option value="">Any...</option>
                <option value="1" data-count="3">First</option>
                <option value="2" data-count="11">Second</option>
                <option value="3" data-count="6">Third</option>
            </select>
            <label><span class="badge">2</span> fancy select</label>
            <div class="well"> </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFancySelect1 div').simplicityFancySelect({
                  select: '#exampleFancySelect1 select'
                });
            });
        </script>
        <p>
            Change the selection in <span class="badge">1</span> and the visible
            state in <span class="badge">2</span> is updated.
        </p>
        <p>
            Click on rows in <span class="badge">2</span> and the value in
            <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Templating</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            The HTML template can be customized in two different ways. You can
            either set the <code>template</code> option to a valid HTML content
            string or set it to <code>''</code> and place the template in the
            DOM.
        </p>
        <p>
            Let's configure the widget to use a trimmed down version of the HTML
            (excluding the facet count data attribute).
        </p>
    </div>
</div>

<div class="page-header">
  <h2>Option template</h2>
</div>
<div class="row">
    <div class="span8">
        <p>
            First by using the <code>template</code> widget option.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="example">
    <select name="example">
        <option value="">Any...</option>
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
    </select>
    <div></div>
</div>
{% endhighlight %}
        <h3>JavaScript</h3>
{% highlight javascript %}
$('#example div').simplicityFancySelect({
    select: '#example select',
    template: '<ul class="options"><li class="option"><a href="#" class="label"/></li></ul>'
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFancySelect2" class="well">
            <select name="example">
                <option value="">Any...</option>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
            </select>
            <div class="well"> </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFancySelect2 div').simplicityFancySelect({
                  select: '#exampleFancySelect2 select',
                  template: "<ul class='options'><li class='option'><a href='#' class='label'/></li></ul>"
                });
            });
        </script>
    </div>
</div>

<div class="page-header">
  <h2>DOM template</h2>
</div>
<div class="row">
    <div class="span8">
        <p>
            Second, by using the DOM target to specify the template.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="example">
    <select name="example">
        <option value="">Any...</option>
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
    </select>
    <div>
        <ul class="options">
            <li class="option"><a href="#" class="label"></a></li>
        </ul>
    </div>
</div>
{% endhighlight %}
        <p>
            JavaScript. Note that we override the <code>template</code> option to be
            <code>''</code> so that the widget falls back to the DOM element's
            contents.
        </p>
{% highlight javascript %}
$('#example div').simplicityFancySelect({
    select: '#example select',
    template: ''
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFancySelect3" class="well">
            <select name="example">
                <option value="">Any...</option>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
            </select>
            <div class="well">
                <ul class="options">
                    <li class="option"><a href="#" class="label"> </a></li>
                </ul>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFancySelect3 div').simplicityFancySelect({
                  select: '#exampleFancySelect3 select',
                  template: ''
                });
            });
        </script>
    </div>
</div>

<div class="page-header">
  <h1>Multi Select</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            If the <code>select</code> is configured to support multiple
            selection, then you can select multiple rows in the fancy version.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="example">
    <select name="example" multiple="multiple">
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
        <option value="4">Fourth</option>
        <option value="5">Fifth</option>
    </select>
    <div>
        <ul class="options">
            <li class="option"><a href="#" class="label"></a></li>
        </ul>
    </div>
</div>
{% endhighlight %}
        <h3>JavaScript</h3>
{% highlight javascript %}
$('#example div').simplicityFancySelect({
    select: '#example select',
    template: ''
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFancySelect4" class="well">
            <label><span class="badge">1</span> select</label>
            <select name="example" multiple="multiple" size="5">
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
                <option value="5">Fifth</option>
            </select>
            <label><span class="badge">2</span> fancy select</label>
            <div class="well">
                <ul class="options">
                    <li class="option"><a href="#" class="label"> </a></li>
                </ul>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFancySelect4 div').simplicityFancySelect({
                  select: '#exampleFancySelect4 select',
                  template: ''
                });
            });
        </script>
        <p>
            Change the selection in <span class="badge">1</span> and the visible
            state in <span class="badge">2</span> is updated.
        </p>
        <p>
            Click on rows in <span class="badge">2</span> and the value in
            <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Checkboxes</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            You can enable support for checkboxes by adding the
            <code>option-checkbox</code> class to them.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="example">
    <select name="example" multiple="multiple">
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
        <option value="4">Fourth</option>
        <option value="5">Fifth</option>
    </select>
    <div>
        <ul class="options">
            <li class="option">
                <label>
                    <input type="checkbox" name="example" class="option-checkbox" />
                    <span class="label"></span>
                </label>
            </li>
        </ul>
    </div>
</div>
{% endhighlight %}
        <h3>JavaScript</h3>
{% highlight javascript %}
$('#example div').simplicityFancySelect({
    select: '#example select',
    template: ''
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFancySelect5" class="well">
            <select name="example" multiple="multiple" size="5">
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
                <option value="5">Fifth</option>
            </select>
            <div class="well">
                <ul class="options">
                    <li class="option">
                        <label>
                            <input type="checkbox" name="example" class="option-checkbox" />
                            <span class="label"> </span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFancySelect5 div').simplicityFancySelect({
                  select: '#exampleFancySelect5 select',
                  template: ''
                });
            });
        </script>
    </div>
</div>

<div class="page-header">
  <h1>Radio Buttons</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Radio buttons can also be used by using the <code>radioStyle</code>
            and <code>checkableInputSelector</code> options.
        </p>
        <h3>HTML</h3>
{% highlight html %}
<div id="example">
    <select name="example">
        <option value="">Any...</option>
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
        <option value="4">Fourth</option>
        <option value="5">Fifth</option>
    </select>
    <div>
        <ul class="options">
            <li class="option">
                <label>
                    <input type="radio" name="example" class="option-radio" />
                    <span class="label"></span>
                </label>
            </li>
        </ul>
    </div>
</div>
{% endhighlight %}
        <h3>JavaScript</h3>
{% highlight javascript %}
$('#example div').simplicityFancySelect({
    select: '#example select',
    template: '',
    radioStyle: true,
    checkableInputSelector: ':radio.option-radio'
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFancySelect6" class="well">
            <select name="example">
                <option value="">Any...</option>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
                <option value="5">Fifth</option>
            </select>
            <div class="well">
                <ul class="options">
                    <li class="option">
                        <label>
                            <input type="radio" name="example" class="option-radio" />
                            <span class="label"> </span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFancySelect6 div').simplicityFancySelect({
                  select: '#exampleFancySelect6 select',
                  template: '',
                  radioStyle: true,
                  checkableInputSelector: ':radio.option-radio'
                });
            });
        </script>
    </div>
</div>
