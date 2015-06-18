import $ from 'jquery';

export default class Tabs {
  constructor(options) {
    this.$el = $('[data-tabs]');

    this.options = $.extend({
      activeClass: 'active'
    }, options);

    this._init();
    this._bindEvents();
  }

  _init() {
    const $firstTab = this.$el.find('a').eq(0);
    const firstTabPanel = $firstTab.attr('href');

    $firstTab.parent().addClass(this.options.activeClass);
    $(firstTabPanel).addClass(this.options.activeClass);
  }

  _bindEvents() {
    this.$el.find('a').on('click', (e) => {
      e.preventDefault();
      this._changeTabs(e);
    });
  }

  _changeTabs(e) {
    const $target = $(e.currentTarget);

    this._toggleClasses($target.parent());
    this._toggleClasses($($target.attr('href')));
  }

  _toggleClasses($el) {
    $el
      .addClass(this.options.activeClass)
      .siblings()
      .removeClass(this.options.activeClass);
  }
}
