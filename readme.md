# Bigcommerce Tabs UI Module

Create a tabbed UI element

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
 
  