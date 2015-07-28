import $ from 'jquery';
import Tabs from '../../dist/js/tabs';

const tabs = new Tabs();

$('.tab-link').bind('click', (evt) => {
  evt.preventDefault;
  const $target = $(evt.currentTarget);
  tabs.displayTabContent($target.attr('href'));
});
