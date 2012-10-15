---
layout: default
nav: userguide
nav2: simplicityInputs
title: simplicityInputs
subhead: simplicityInputs
lead: Binding HTML inputs to state.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicityInputs</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            We progressively enhance the standard HTML <code>input</code>
            elements to bind them to the widget state and thus decouple UI
            features from the backend search specific widgets.
        </p>
        <p>
            Changes to the <code>input</code>s are automatically reflected in
            the state. Changes to the state are automatically reflected in the
            <code>input</code>s.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Text Input</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a single <code>input</code> to the state, first create the
            input.
        </p>
{% highlight html %}
<input type="text" name="example">
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to it.
        </p>
{% highlight javascript %}
$('input').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the <code>input</code> will cause the state to be updated
            and changes to the state will be reflected in the
            <code>input</code>.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleInput" class="well">
            <label><span class="badge">1</span> input</label>
            <input name="example" class="input-large" />
            <label><span class="badge">2</span> state</label>
            <textarea name="state" rows="3" class="input-large">
            </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleInput textarea:last').simplicityState();
                $('#exampleInput input').simplicityInputs({
                  stateElement: '#exampleInput textarea:last'
                });
                $('#exampleInput textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {example: '4'});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>, deselect and the
            state JSON in <span class="badge">2</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">2</span>, deselect and the
            value in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Textarea</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a single <code>textarea</code> to the state, first create
            the input.
        </p>
{% highlight html %}
<textarea type="text" name="example"> </textarea>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to it.
        </p>
{% highlight javascript %}
$('textarea').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the <code>textarea</code> will cause the state to be
            updated and changes to the state will be reflected in the
            <code>textarea</code>.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleTextarea" class="well">
            <label><span class="badge">1</span> textarea</label>
            <textarea name="example" rows="3" class="input-large">
            </textarea>
            <label><span class="badge">2</span> state</label>
            <textarea name="state" rows="4" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleTextarea textarea:last').simplicityState();
                $('#exampleTextarea textarea:first').simplicityInputs({
                  stateElement: '#exampleTextarea textarea:last'
                });
                $('#exampleTextarea textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {example: 'example text\ngoes here'});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>, deselect and the
            state JSON in <span class="badge">2</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">2</span>, deselect and the
            value in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Checkboxes</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a set of <code>&lt;input type="checkbox"></code> to the
            state, first create the inputs.
        </p>
{% highlight html %}
<fieldset>
  <label><input type="checkbox" name="example" value="1" /> First</label>
  <label><input type="checkbox" name="example" value="2" /> Second</label>
  <label><input type="checkbox" name="example" value="3" /> Third</label>
</fieldset>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to them.
        </p>
{% highlight javascript %}
$('fieldset').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the checkboxes will cause the state to be updated and
            changes to the state will be reflected in the checkboxes.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleCheckboxes" class="well">
            <fieldset>
                <label><span class="badge">1</span> checkboxes</label>
                <label class="checkbox">
                    <input type="checkbox" name="example" value="1" />First
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="example" value="2" />Second
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="example" value="3" />Third
                </label>
            </fieldset>
            <label><span class="badge">2</span> state</label>
            <textarea name="state" rows="7" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleCheckboxes textarea:last').simplicityState();
                $('#exampleCheckboxes fieldset').simplicityInputs({
                  stateElement: '#exampleCheckboxes textarea:last'
                });
                $('#exampleCheckboxes textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {example: '2'});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>, deselect and the
            state JSON in <span class="badge">2</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">2</span>, deselect and the
            value in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Radio buttons</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a set of <code>&lt;input type="radio"></code> to the state,
            first create the inputs.
        </p>
{% highlight html %}
<fieldset>
  <label><input type="radio" name="example" value="a" /> Alpha</label>
  <label><input type="radio" name="example" value="b" /> Bravo</label>
  <label><input type="radio" name="example" value="c" /> Charlie</label>
</fieldset>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to them.
        </p>
{% highlight javascript %}
$('fieldset').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the checkboxes will cause the state to be updated and
            changes to the state will be reflected in the checkboxes.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleRadios" class="well">
            <fieldset>
                <label><span class="badge">1</span> radio buttons</label>
                <label class="radio">
                    <input type="radio" name="example" value="a" />Alpha
                </label>
                <label class="radio">
                    <input type="radio" name="example" value="b" />Bravo
                </label>
                <label class="radio">
                    <input type="radio" name="example" value="c" />Charlie
                </label>
            </fieldset>
            <label><span class="badge">2</span> state</label>
            <textarea name="state" rows="3" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleRadios textarea:last').simplicityState();
                $('#exampleRadios fieldset').simplicityInputs({
                  stateElement: '#exampleRadios textarea:last'
                });
                $('#exampleRadios textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {example: 'c'});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>, deselect and the
            state JSON in <span class="badge">2</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">2</span>, deselect and the
            value in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Select</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a single <code>&lt;select></code> to the state, first create
            the select.
        </p>
{% highlight html %}
<select name="example">
    <option value="">Any...</option>
    <option value="1">First</option>
    <option value="2">Second</option>
    <option value="3">Third</option>
</select>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to it.
        </p>
{% highlight javascript %}
$('select').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the checkboxes will cause the state to be updated and
            changes to the state will be reflected in the checkboxes.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleSelect" class="well">
            <label><span class="badge">1</span> select</label>
            <select name="example">
                <option value="">Any...</option>
                <option value="1" data-count="11">First</option>
                <option value="2" data-count="3">Second</option>
                <option value="3" data-count="6">Third</option>
            </select>
            <label><span class="badge">2</span> state</label>
            <textarea name="state" rows="3" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleSelect textarea:last').simplicityState();
                $('#exampleSelect select').simplicityInputs({
                  stateElement: '#exampleSelect textarea:last'
                });
                $('#exampleSelect textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>, deselect and the
            state JSON in <span class="badge">2</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">2</span>, deselect and the
            value in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Multiple Select</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a multiple <code>&lt;select></code> to the state, first
            create the select.
        </p>
{% highlight html %}
<select name="example" multiple="multiple">
    <option value="1">First</option>
    <option value="2">Second</option>
    <option value="3">Third</option>
    <option value="4">Fourth</option>
</select>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to it.
        </p>
{% highlight javascript %}
$('select').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the checkboxes will cause the state to be updated and
            changes to the state will be reflected in the checkboxes.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleMultiSelect" class="well">
            <label><span class="badge">1</span> select</label>
            <select name="example" multiple="multiple">
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
            </select>
            <label><span class="badge">2</span> state</label>
            <textarea name="state" rows="8" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleMultiSelect textarea:last').simplicityState();
                $('#exampleMultiSelect select').simplicityInputs({
                  stateElement: '#exampleMultiSelect textarea:last'
                });
                $('#exampleMultiSelect textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>, deselect and the
            state JSON in <span class="badge">2</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">2</span>, deselect and the
            value in <span class="badge">1</span> is updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Multiple inputs single-select</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a multiple single-select capable <code>input</code>`s to the
            state, first create them.
        </p>
{% highlight html %}
<input name="example"/>

<label><input type="radio" name="example" value="a" />Alpha</label>
<label><input type="radio" name="example" value="b" />Bravo</label>
<label><input type="radio" name="example" value="c" />Charlie</label>

<select name="example">
    <option value="">Any...</option>
    <option value="a">Alpha</option>
    <option value="b">Bravo</option>
    <option value="c">Charlie</option>
</select>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to it.
        </p>
{% highlight javascript %}
$(':input').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the checkboxes will cause the state to be updated and
            changes to the state will be reflected in the checkboxes.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="multiInputSingleSelect" class="well">
            <label><span class="badge">1</span> input</label>
            <input name="example" class="input-large" />
            <label><span class="badge">2</span> radio buttons</label>
            <label class="radio"><input type="radio" name="example" value="a" />Alpha</label>
            <label class="radio"><input type="radio" name="example" value="b" />Bravo</label>
            <label class="radio"><input type="radio" name="example" value="c" />Charlie</label>
            <label><span class="badge">3</span> select</label>
            <select name="example">
                <option value="">Any...</option>
                <option value="a">Alpha</option>
                <option value="b">Bravo</option>
                <option value="c">Charlie</option>
            </select>
            <label><span class="badge">4</span> state</label>
            <textarea name="state" rows="3" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#multiInputSingleSelect textarea:last').simplicityState();
                $('#multiInputSingleSelect input, #multiInputSingleSelect select').simplicityInputs({
                  stateElement: '#multiInputSingleSelect textarea:last'
                });
                $('#multiInputSingleSelect textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span>,
            <span class="badge">2</span> or <span class="badge">3</span>,
            deselect and the state JSON in <span class="badge">4</span> is
            updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">4</span>, deselect and the
            values in <span class="badge">1</span>, <span class="badge">2</span>
            and <span class="badge">3</span> are updated.
        </p>
    </div>
</div>

<div class="page-header">
  <h1>Multiple inputs multi-select</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To bind a multiple mutli-select capable <code>input</code>s to the
            state, first create them.
        </p>
{% highlight html %}
<label><input type="checkbox" name="example" value="a" />Alpha</label>
<label><input type="checkbox" name="example" value="b" />Bravo</label>
<label><input type="checkbox" name="example" value="c" />Charlie</label>

<select name="example">
    <option value="a">Alpha</option>
    <option value="b">Bravo</option>
    <option value="c">Charlie</option>
</select>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityInputs</code> widget to it.
        </p>
{% highlight javascript %}
$(':input').simplicityInputs();
{% endhighlight %}
        <p>
            Changes to the checkboxes will cause the state to be updated and
            changes to the state will be reflected in the checkboxes.
        </p>
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="multiInputMultiSelect" class="well">
            <label><span class="badge">1</span> radio buttons</label>
            <label class="checkbox"><input type="checkbox" name="example" value="a" />Alpha</label>
            <label class="checkbox"><input type="checkbox" name="example" value="b" />Bravo</label>
            <label class="checkbox"><input type="checkbox" name="example" value="c" />Charlie</label>
            <label><span class="badge">2</span> select</label>
            <select name="example" multiple="multiple">
                <option value="a">Alpha</option>
                <option value="b">Bravo</option>
                <option value="c">Charlie</option>
            </select>
            <label><span class="badge">3</span> state</label>
            <textarea name="state" rows="7" class="input-large"> </textarea>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#multiInputMultiSelect textarea:last').simplicityState();
                $('#multiInputMultiSelect input, #multiInputMultiSelect select').simplicityInputs({
                  stateElement: '#multiInputMultiSelect textarea:last'
                });
                $('#multiInputMultiSelect textarea:last')
                    .simplicityDocsStateEditor()
                    .simplicityState('state', {});
            });
        </script>
        <p>
            Change the value in <span class="badge">1</span> or
            <span class="badge">2</span>, deselect and the state JSON in
            <span class="badge">3</span> is updated.
        </p>
        <p>
            Alter the JSON in <span class="badge">3</span>, deselect and the
            values in <span class="badge">1</span> and
            <span class="badge">2</span> are updated.
        </p>
    </div>
</div>
