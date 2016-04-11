# Bigcommerce Tabs UI Module

Create a tabbed UI element

## TODO
- Update `_toggleClasses` to allow for accordion layout.
- Add responsive setting that allows tabbed UI to break down into accordion at smaller screen sizes

## Installation

```
jspm install --save bc-tabs=bitbucket:pixelunion/bc-tabs
```


## Options

All options are optional.

### `moduleSelector`
The jQuery object of the tab nav container. defaults to `$('[data-tabs]')`.

### `titleSelector`
The jQuery object of the tab nav `<li>` element. defaults to `$('.tab-title')`.

### `activeClass`
Class given to both the nav element and content container for the currently active tab.

### `afterSetup`
Callback function called once the tabs have been initialized. Gets passed the id of the currently active tab.

### `afterChange`
Callback function called when a tab is clicked. Gets passed the id of the clicked tab.

### `tabHistory`
Leverage the history API for tab chages. Defaults to `false`.



## Some sample markup

### Tabs
```
<ul class="tabs" data-tabs>
  <li class="tab-title"><a href="#featured-products">Featured Products</a></li>
  <li class="tab-title"><a href="#best-sellers">Best Sellers</a></li>
</ul>
<div class="tabs-content">
  <div class="tabs-content-panel" id="featured-products">
    Tab panel content
  </div>
  <div class="tabs-content-panel" id="best-sellers">
    Tab panel content
  </div>
</div>
```

### Accordion
```
<section data-tabs>
  <h2 class="tab-title"><a href="#hello">tab</a></h2>
  <div class="tabs-content-panel" id="hello">
   content with an anchor
   <a href="http://google.com">google</a>
  </div>
  <h2 class="tab-title"><a href="#goodbye">tab2</a></h2>
  <div class="tabs-content-panel" id="goodbye">
   other content
  </div>
</section>
```

### Javascript
```
// Constructor:
this.tabs = new Tabs({
  afterSetup: (tabId) => {
    alert(`The tabs are ready! the current tab is ${tabId}`);
  },
  afterChange: () => {
    alert(`A tab has been changed! the new tab is ${tabId}`);
  }
});

// _bind:
this.tabs.displayTabContent('#leave-review');
```

### SCSS
```
// Style the tab themselves.
.tab-title {
  font-weight: normal;

  &.active {
    font-weight: bold;
  }
}

.tab-content-panel {
  display: none;

  &.active {
    display: block;
  }
}
```

### Further Development

For debugging or improvements you can run a standalone test version of the module using a very basic webpack development server:

```
$ npm install
$ npm run demo
```
This will allow you to make changes to the JS and HTML while working with a live demo in your browser. 
