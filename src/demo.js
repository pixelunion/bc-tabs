// Basic script to power the demo page, imports tab modules and instantiates

import $ from 'jquery';
import Tabs from './tabs';

// Include the styling
require('./_tabs.scss');

const tabs = new Tabs();

$('.tab-link').bind('click', (evt) => {
  evt.preventDefault;
  const $target = $(evt.currentTarget);
  tabs.displayTabContent($target.attr('href'));
});
