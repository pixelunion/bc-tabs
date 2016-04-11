'format es6'
// Required for JSPM to understand module format

import $ from 'jquery';

export default class Tabs {
  constructor(options) {
    this.options = $.extend({
      moduleSelector: $('[data-tabs]'),
      titleSelector: $('.tab-title'),
      activeClass: 'active',
      afterSetup: () => {},
      afterChange: () => {},
      tabHistory: false
    }, options);

    this.$el = this.options.moduleSelector;

    this._init();
    this._bindEvents();
  }

  _init() {
    const hash = window.location.hash;

    // Loop through each tab UI
    this.$el.each((idx, el) => {
      const $tabUI = $(el);
      let $activeTab = $tabUI.find(this.options.titleSelector).first().find('a');
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
      this.options.afterSetup($activeTab.attr('href'));
    });
  }

  _bindEvents() {
    this.$el.on('click', `${this.options.titleSelector.selector} a`, (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const tabId = $target.attr('href');
      this._toggleClasses($target.parent());
      this.displayTabContent(tabId);

      if (history.pushState) {
        if (this.options.tabHistory) {
          history.pushState({}, tabId, tabId);
        } else {
          history.replaceState({}, tabId, tabId);
        }
      } else {
        window.location.hash = tabId;
      }
    });

    $(window).on('hashchange', (e) => {
      const hash = window.location.hash;

      this.displayTabContent(hash);
    });
  }

  // Update the tab navigation "active" state.
  _updateTabNav(tabId) {
    const hrefSelector = `[href="${tabId}"]`;
    const $navItem = this.options.titleSelector.find(hrefSelector);

    this.options.titleSelector.removeClass(this.options.activeClass);
    this._toggleClasses($navItem.parent());
  }

  // Update the tab content "active" state (showing the tab).
  displayTabContent(tabId) {
    this._toggleClasses($(tabId));

    this._updateTabNav(tabId);

    this.options.afterChange(tabId);
  }

  // Swap the active state on while turning off any siblings.
  _toggleClasses($el) {
    $el
      .addClass(this.options.activeClass)
      .siblings()
      .removeClass(this.options.activeClass);
  }
}
