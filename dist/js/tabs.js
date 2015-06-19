import $ from 'jquery';

export default class Tabs {
  constructor(options) {
    this.$el = $('[data-tabs]');

    this.options = $.extend({
      activeClass: 'active',
      afterSetup: () => {},
      afterChange: () => {}
    }, options);

    this._init();
    this._bindEvents();
  }

  _init() {
    const hash = window.location.hash;

    // Loop through each tab UI
    this.$el.each((idx, el) => {
      const $tabUI = $(el);
      let $activeTab = $tabUI.find('a').eq(0);
      let $activeTabPanel = $($activeTab.attr('href'));
      const $inactiveTabPanels = $activeTabPanel.siblings();

      if (hash) {
        // Check if hash is a match to one of the tab panel IDs
        // If it is, make that panel active instead
        $inactiveTabPanels.each((idx, el) => {
          const tabId = `#${$(el).attr('id')}`;

          if (tabId == hash) {
            $activeTab = this.$el.find(`a[href="${tabId}"]`);
            $activeTabPanel = $(tabId);
          }
        });
      }

      // Add active class to tab and panel
      $activeTab.parent().addClass(this.options.activeClass);
      $activeTabPanel.addClass(this.options.activeClass);

      // afterSetup callback
      this.options.afterSetup.call();
    });
  }

  _bindEvents() {
    this.$el.find('a').on('click', (e) => {
      e.preventDefault();
      this._changeTabs(e);
    });
  }

  _changeTabs(e) {
    const $target = $(e.currentTarget);

    window.location.hash = $target.attr('href');
    this._toggleClasses($target.parent());
    this._toggleClasses($($target.attr('href')));

    // afterChange callback
    this.options.afterChange.call();
  }

  _toggleClasses($el) {
    $el
      .addClass(this.options.activeClass)
      .siblings()
      .removeClass(this.options.activeClass);
  }
}
