---
layout: default
nav: userguide
nav2: simplicityFacetedSelect
title: simplicityFacetedSelect
subhead: simplicityFacetedSelect
lead: Dynamic options and counts.
---

{% include userguide/nav.html %}

<div class="page-header">
  <h1>simplicityFacetedSelect</h1>
</div>
<div class="row">
    <div class="span8">
        <p>
            To enhance a <code>&lt;select></code> to automatically populate it
            from the search results, first create the select.
        </p>
{% highlight html %}
<select name="example">
    <option value="">Any...</option>
</select>
{% endhighlight %}
        <p>
            Then apply the <code>simplicityFacetedSelect</code> widget to it.
        </p>
{% highlight javascript %}
$('select').simplicityFacetedSelect();
{% endhighlight %}
    </div>
    <div class="span4">
        <h3>Example</h3>
        <div id="exampleFacetedSelect">
            <label><span class="badge">1</span> faceted select</label>
            <select name="example">
                <option value="">Any...</option>
            </select>
            <label><span class="badge">2</span> option template</label>
            <select name="optionTemplate">
                <option>{option}</option>
                <option>{option} {count}</option>
            </select>
            <label><span class="badge">3</span> search response</label>
            <select name="response">
                <option value='{% capture value %}{
  _discovery:{
    response:{
      facets:{
        example:{
        }
      }
    }
  }
}{% endcapture %}{{ value | escape }}'>None</option>
                <option selected="selected" value='{% capture value %}{
  _discovery:{
    response:{
      facets:{
        example:{
          childIds: ["A","B","C"],
          data: {
            A: {count:7, label:"Alpha"},
            B: {count:1, label:"Bravo"},
            C: {count:2, label:"Charlie"}
          }
        }
      }
    }
  }
}{% endcapture %}{{ value | escape }}'>ABC</option>
                <option value='{% capture value %}{
  _discovery:{
    response:{
      facets:{
        example:{
          childIds: ["B","C","A"],
          data: {
            A: {count:7, label:"Alpha"},
            B: {count:1, label:"Bravo"},
            C: {count:2, label:"Charlie"}
          }
        }
      }
    }
  }
}{% endcapture %}{{ value | escape }}'>BCA</option>
                <option value='{% capture value %}{
  _discovery:{
    response:{
      facets:{
        example:{
          childIds: ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
          data: {
            AL: {label:"Alabama",count:1},
            AK: {label:"Alaska",count:2},
            AZ: {label:"Arizona",count:3},
            AR: {label:"Arkansas",count:4},
            CA: {label:"California",count:5},
            CO: {label:"Colorado",count:6},
            CT: {label:"Connecticut",count:7},
            DE: {label:"Delaware",count:8},
            DC: {label:"District of Columbia",count:9},
            FL: {label:"Florida",count:8},
            GA: {label:"Georgia",count:7},
            HI: {label:"Hawaii",count:6},
            ID: {label:"Idaho",count:5},
            IL: {label:"Illinois",count:4},
            IN: {label:"Indiana",count:3},
            IA: {label:"Iowa",count:2},
            KS: {label:"Kansas",count:1},
            KY: {label:"Kentucky",count:2},
            LA: {label:"Louisiana",count:3},
            ME: {label:"Maine",count:4},
            MD: {label:"Maryland",count:5},
            MA: {label:"Massachusetts",count:6},
            MI: {label:"Michigan",count:7},
            MN: {label:"Minnesota",count:8},
            MS: {label:"Mississippi",count:9},
            MO: {label:"Missouri",count:8},
            MT: {label:"Montana",count:7},
            NE: {label:"Nebraska",count:6},
            NV: {label:"Nevada",count:5},
            NH: {label:"New Hampshire",count:4},
            NJ: {label:"New Jersey",count:3},
            NM: {label:"New Mexico",count:2},
            NY: {label:"New York",count:1},
            NC: {label:"North Carolina",count:2},
            ND: {label:"North Dakota",count:3},
            OH: {label:"Ohio",count:4},
            OK: {label:"Oklahoma",count:5},
            OR: {label:"Oregon",count:6},
            PA: {label:"Pennsylvania",count:7},
            RI: {label:"Rhode Island",count:8},
            SC: {label:"South Carolina",count:9},
            SD: {label:"South Dakota",count:8},
            TN: {label:"Tennessee",count:7},
            TX: {label:"Texas",count:6},
            UT: {label:"Utah",count:5},
            VT: {label:"Vermont",count:4},
            VA: {label:"Virginia",count:3},
            WA: {label:"Washington",count:2},
            WV: {label:"West Virginia",count:1},
            WI: {label:"Wisconsin",count:2},
            WY: {label:"Wyoming",count:3}
          }
        }
      }
    }
  }
}{% endcapture %}{{ value | escape }}'>States</option>
            </select>
            <pre style="height: 8em; overflow: scroll;"></pre>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#exampleFacetedSelect select[name="example"]').simplicityFacetedSelect({
                    searchElement: '#exampleFacetedSelect'
                });

                $('#exampleFacetedSelect pre').simplicityDocsJsonSelector({
                    selectElement: '#exampleFacetedSelect select[name="response"]',
                    change: function (evt, json) {
                        $('#exampleFacetedSelect').triggerHandler('simplicitySearchResponse', json);
                    }
                });
                $('#exampleFacetedSelect select[name="optionTemplate"]')
                    .change(function (evt) {
                        $('#exampleFacetedSelect  select[name="example"]')
                            .simplicityFacetedSelect('option', 'optionTemplate', $(evt.target).val());
                        $('#exampleFacetedSelect  select[name="response"]').change();
                    })
                    .change();
            });
        </script>
        <p>
            Change the optionTemplate in <span class="badge">2</span> or
            the search response in <span class="badge">3</span> and see how the
            available options in <span class="badge">1</span> are updated. Note
            how selections in <span class="badge">1</span> are preserved across
            updates.
        </p>
    </div>
</div>
