import $ from 'jquery';

export default class Tabs {
  constructor(options) {
    this.options = $.extend({
      moduleSelector: $('[data-tabs]'),
      titleSelector: $('.tab-title'),
      activeClass: 'active',
      afterSetup: () => {},
      afterChange: () => {}
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
      this.options.afterSetup.call();
    });
  }

  _bindEvents() {
    this.$el.find('a').on('click', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      this._toggleClasses($target.parent());
      this.displayTabContent($target.attr('href'));
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
    window.location.hash = tabId;

    this._toggleClasses($(tabId));
    this._updateTabNav(tabId);

    this.options.afterChange.call();
  }

  // Swap the active state on while turning off any siblings.
  _toggleClasses($el) {
    $el
      .addClass(this.options.activeClass)
      .siblings()
      .removeClass(this.options.activeClass);
  }
}
