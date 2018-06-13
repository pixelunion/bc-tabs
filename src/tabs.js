import $ from 'jquery';
import debounce from 'just-debounce';

export default class Tabs {
  constructor(options) {
    this.options = $.extend({

      // Scoping the tabs (event binding), link class, and content
      tabScope: '[data-tabs]',
      tabToggle: '[data-tab-link]',
      tabContent: '[data-tab-content]',
      toggleTab: this._defaultToggleTab,
      keepTabsOpen: this.keepTabsOpen,
      activeClass: 'active',
      defaultTab: '',
      afterSetup: () => {},
      afterChange: ($element) => {},
      tabHistory: false,
    }, options);

    this.$scope = $(this.options.tabScope);
    this.$tabToggles = $(this.options.tabToggle);
    this.$tabContents = $(this.options.tabContent);

    this.defaultTab = this.options.defaultTab || this.$tabContents.get(0);

    this.currentTab = this._defaultTab();
    this.previousStyle = this._getTabStyle();

    this._bindEvents();
    this._init();
    this.options.afterSetup();
  }

  /* ----------------------------------------------------------------------- /
   Default functions: can be overridden by passing callbacks into constructor
   */

  // Find out the default tab (if none selected in options)
  _defaultTab() {
    return this.$tabContents.first().attr('id');
  }

  // Default function to toggle a tab between active / inactive
  _defaultToggleTab(element, active) {
    const $element = $(element);

    $element.toggleClass(this.activeClass, active);
  }

  _getTabStyle() {
    const pseudoElem = window.getComputedStyle(this.$scope.get(0), ':before').content.replace(/"/g, '');
    return pseudoElem;
  }

  // Default function to toggle some content on or off
  _defaultToggleContent(element, active) {
    const $element = $(element);

    if (active) {
      // Set the tab to active
      if (this.previousStyle === 'slide') {
        // show with a slidetoggle
        $element.slideDown('fast', () => {
          this.options.afterChange($element);
        });
      } else {
        // Show simply via display
        $element.show();
        this.options.afterChange($element);
      }
    } else {
      // Set the tab to inactive
      if (this.previousStyle === 'slide') {
        // Remove via a slideToggle
        $element.slideUp('fast', () => {
          this.options.afterChange($element);
        });
      } else {
        // Remove via a simple hide
        $element.hide();
        this.options.afterChange($element);
      }
    }
  }

  // Determine if we should target all tabs or individual tabs
  // (Swap between tab and accordion functionality.)
  keepTabsOpen() {
    return window.innerWidth < 800;
  }

  /* ----------------------------------------------------------------------- /
   Activation functions: Trigger the callbacks for showing / hiding tab
   components and links
   */

  // Set a particular tab as active (and optionally disable others)
  // This function is a wrapper for activating both the tab-link and
  // tab-content at the same time.
  activateTab(hash, closeOthers) {

    // necessary to check for links that link to tabs that aren't available:
    if (!$(hash).length) {
      console.log('tab doesn\'t exist!');
      return;
    }

    const isSticky = closeOthers || this.options.keepTabsOpen();
    this.activateTabToggle(hash, isSticky);
    this.activateTabContent(hash, isSticky);
  }

  // Remove bc-tabs if content with tabs is updated, refreshed or replaced
  unload() {
    this.$scope.off('.bc-tabs');
    $(window).off('.bc-tabs');
  }

  // Set a particular [data-tab-toggle] link as active,
  // and (optionally) deactivate others
  activateTabToggle(hash, isSticky = false) {

    const $thisTab = $(hash);

    // Find tablinks that point to this hash
    const $tabLinks = this.$tabToggles.filter(function() {
      return $(this).attr('href') === hash;
    });

    if (!isSticky) {
      // Tab stickyness not active, target all other tabs in group

      if ($thisTab.is(':visible')) return;
      // Grab all the groups these links belong to
      const tabsGroups = [];
      $tabLinks.each(function() {
        const thisTabGroup = $(this).data('tabs-group');
        if (tabsGroups.indexOf(thisTabGroup) === -1) {
          tabsGroups.push(thisTabGroup);
        }
      });

      // Filter all the tabs to only those belonging to these groups
      const $tabsGroup = this.$tabToggles.filter(function() {
        return tabsGroups.indexOf($(this).data('tabs-group')) > -1;
      });

      // Disable all the tab links
      for (let i = 0; i < $tabsGroup.length; i++) {
        this.options.toggleTab($tabsGroup[i], false);
      }

      // Enable just the tab links associated with this hash
      for (let i = 0; i < $tabLinks.length; i++) {
        this.options.toggleTab($tabLinks[i], true);
      }
    } else {
      // Tabs are sticky, so we should only toggle items matching this hash
      if ($thisTab.is(':visible')) {
        // Enable just the tab links associated with this hash
        for (let i = 0; i < $tabLinks.length; i++) {
          this.options.toggleTab($tabLinks[i], false);
        }
      } else {
        for (let i = 0; i < $tabLinks.length; i++) {
          this.options.toggleTab($tabLinks[i], true);
        }
      }
    }
  }

  // Activate a content-element with the corresponding hash, and
  // (optionally) hide others in group
  activateTabContent(hash, isSticky = false) {
    const $thisTab = $(hash);

    if (!isSticky) {

      if ($thisTab.is(':visible')) return;

      // Locate other tabs that share the same 'tabs-group'
      const tabsGroup = $thisTab.data('tabs-group');
      const $tabsGroup = this.$tabContents.filter(function() {
        return $(this).data('tabs-group') === tabsGroup;
      });

      // Disable other tabs in this group
      for (let i = 0; i < $tabsGroup.length; i++) {
        this._defaultToggleContent($tabsGroup[i], false);
      }
      // Enable this tab content
      this._defaultToggleContent($thisTab, true);
    } else {
      // Tabs are sticky, so we only toggle the individual item
      if ($thisTab.is(':visible')) {
        this._defaultToggleContent($thisTab, false);
      } else {
        this._defaultToggleContent($thisTab, true);
      }
    }
  }

  /* ----------------------------------------------------------------------- /
   Miscellaneous: deal with initing the base tab state (say after resizing
   the viewport or on page load) and event binding.
   */

  // Function to run when tabs are first init (sets one active over others)
  _init(checkStyleMatch) {
    if (checkStyleMatch) {
      const currentStyle = this._getTabStyle();

      if (this.previousStyle == currentStyle) {
        return;
      }

      this.previousStyle = currentStyle;
    }

    const hash = window.location.hash || `#${this.defaultTab.id}`;
    const currentTab = hash ? `a[href="${hash}"]` : '[data-tab-link]:first';

    // Disable all the tabs
    for (let i = 0; i < this.$tabToggles.length; i++) {
      this.options.toggleTab(this.$tabToggles.get(i), false);
    }

    for (let i = 0; i < this.$tabContents.length; i++) {
      this._defaultToggleContent(this.$tabContents.get(i), false);
    }

    this._defaultToggleContent(hash, true);
    this.options.toggleTab(currentTab, true);
  }

  // Bind event handlers to the scope target.
  _bindEvents() {
    this.$scope.on('click.bc-tabs', this.options.tabToggle, (event) => {
      event.preventDefault();
      const hash = $(event.target).attr('href');

      this.activateTab(hash);

      if (this.options.tabHistory) {
        history.pushState({}, hash, hash);
      } else {
        history.replaceState({}, hash, hash);
      }
    });

    $(window).on('hashchange.bc-tabs', () => {
      this.activateTab(window.location.hash);
    });

    $(window).on('resize.bc-tabs', debounce(() => {
      this._init(true);
    }, 300));
  }
}
