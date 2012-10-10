---
layout: default
nav: userguide
nav2: simplicitySelectSlider
title: simplicitySelectSlider
subhead: simplicitySelectSlider
lead: Handles are a drag.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicitySelectSlider</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            Create a <code>select</code> with the <code>option</code>s you wish to allow.
        </p>
{% highlight html %}
<div id="example">
    <select name="example">
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
        <option value="e">E<option>
    </select>
    <div></div>
</div>
{% endhighlight %}
        <p>
            Then apply the <code>simplicitySelectSlider</code> widget to it.
        </p>
{% highlight javascript %}
$('#example div').simplicitySelectSlider({
    select: '#example select'
});
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleSlider" class="well">
            <label><span class="badge">1</span> select</label>
            <select name="example">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="e">E</option>
            </select>
            <label><span class="badge">2</span> slider</label>
            <div style="margin: 4em 0 2em 0;"> </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleSlider div').simplicitySelectSlider({
                  select: '#exampleSlider select'
                });
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span> and see how the
            slider in <span class="badge">2</span> is updated.
        </p>
        <p>
            Move the slider in <span class="badge">2</span> and see how the
            selection in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Options</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            There are a few different options to control the look and feel of
            the slider.
        </p>
        <div id="exampleSliderOptions" class="well">
            <div style="margin: 3em 1em 2em 1em;"> </div>
            <label><input name="showTicks" type="checkbox" class="checkbox" /> showTicks</label>
            <label><input name="showLabels" type="checkbox" class="checkbox" /> showLabels</label>
            <label><input name="centerLabels" type="checkbox" class="checkbox" /> centerLabels</label>
            <label><input name="justifyEndLabels" type="checkbox" class="checkbox" /> justifyEndLabels</label>
            <label><input name="showTooltip" type="checkbox" class="checkbox" /> showTooltip</label>
            <label><input name="centerTooltip" type="checkbox" class="checkbox" /> centerTooltip</label>
            <select id="exampleSliderCust" name="example">
                <option value="a">Alpha</option>
                <option value="b">Beta</option>
                <option value="c">Charlie</option>
                <option value="d">Delta</option>
                <option value="e">Echo</option>
            </select>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleSliderOptions div:first').simplicitySelectSlider({
                  select: '#exampleSliderOptions select'
                });
                $('#exampleSliderOptions :checkbox').each(function (idx, elem) {
                    elem.checked = $('#exampleSliderOptions div:first').simplicitySelectSlider('option', elem.name);
                });
                $('#exampleSliderOptions :checkbox').click(function (evt) {
                    var name = evt.target.name,
                        selected = evt.target.checked;
                    $('#exampleSliderOptions div:first').simplicitySelectSlider('option', name, selected);
                });
            });
        </script>
    </div>
</div>