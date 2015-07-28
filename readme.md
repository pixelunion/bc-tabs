# Bigcommerce Tabs UI Module

Create a tabbed UI element
### TODO
- Update `_toggleClasses` to allow for accordion layout.
- Add responsive setting that allows tabbed UI to break down into accordion at smaller screen sizes

### Installation

```
jspm install --save bc-tabs=bitbucket:pixelunion/bc-tabs
```

### Usage



### Options




### Some sample markup

#### Tabs
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

#### Accordion
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

### Sample JS
```
// Constructor:
this.tabs = new Tabs();

// _bind:
this.tabs._changeTabs('#leave-review');
```

#### SCSS
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

For debugging or improvements you can run a standalone test version of the module using a very basic node server:

```
$ npm install
$ jspm install
$ npm run serve
```
This will allow you to make changes to the JS and HTML. To re-compile the scss you'll need to run `npm run build` from a separate terminal window after each change.
