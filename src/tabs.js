'format es6'
// Required for JSPM to understand module format

import $ from 'jquery';

export default class Tabs {
  constructor(options) {
    this.options = $.extend({

      // Scoping the tabs (event binding), link class, and content
      tabScope: '[data-tabs]',
      tabToggle: '[data-tab-link]',
      tabContent: '[data-tab-content]',

      toggleTab: this._defaultToggleTab,
      toggleContent: this._defaultToggleContent,
      keepTabsOpen: this.keepTabsOpen,

      activeClass: 'active',
      defaultTab: '',

      afterSetup: () => {},
      afterChange: () => {},

      tabHistory: false,

    }, options);

    this.$scope = $(this.options.tabScope);
    this.$tabToggles = $(this.options.tabToggle);
    this.$tabContents = $(this.options.tabContent);

    this.defaultTab = this.options.defaultTab || this.$tabContents.get(0);

    // this.currentTab = this.options.currentTab || this._defaultTab();
    this.currentTab = this._defaultTab();

    this._bindEvents();
    this._init();
    // console.log(this.options)
    // console.log(this.currentTab)
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
    if (active) {
      // Set the tab to active
      $element.addClass('active');
    } else {
      // Remove the active class from the tab
      $element.removeClass('active');
    }
  }

  // Default function to toggle some content on or off
  _defaultToggleContent(element, active) {
    const $element = $(element);
    const psuedoElem = window.getComputedStyle($element.get(0), ':before').content;
    console.log('psuedo', psuedoElem);

    // console.log(psuedoElem);
    if (active) {
      // Set the tab to active
      if (psuedoElem === '"slide"') {
        // show with a slidetoggle
        $element.slideDown('fast');
      } else {
        // Show simply via display
        $element.show();
      }
    } else {
      // Set the tab to inactive
      if (psuedoElem === '"slide"') {
        // Remove via a slideToggle
        $element.slideUp('fast');
      } else {
        // Remove via a simple hide
        $element.hide();
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
    if (!$(hash).length) { console.log('tab doesnt exist!'); return; }

    const isSticky = closeOthers ? closeOthers : this.options.keepTabsOpen();
    this.activateTabToggle(hash, isSticky);
    this.activateTabContent(hash, isSticky);
  }

  // Set a particular [data-tab-toggle] link as active, 
  // and (optionally) deactivate others
  activateTabToggle(hash, isSticky=false) {

    const $thisTab = $(hash);

    // Find tablinks that point to this hash
    const $tabLinks = this.$tabToggles.filter(function () {
      return $(this).attr('href') === hash;
    });

    if (!isSticky) {
      // Tab stickyness not active, target all other tabs in group

      if ($thisTab.is(':visible') === true) return;
      // Grab all the groups these links belong to
      const tabsGroups = [];
      $tabLinks.each(function () {
        const thisTabGroup = $(this).data('tabs-group');
        if (tabsGroups.indexOf(thisTabGroup) === -1) {tabsGroups.push(thisTabGroup);}
      });

      // Filter all the tabs to only those belonging to these groups
      const $tabsGroup = this.$tabToggles.filter(function () {
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
      if ($thisTab.is(':visible') === true) {
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
  activateTabContent(hash, isSticky=false) {

    const $thisTab = $(hash);
    console.log('hash clicked was', hash, 'resolved to', $thisTab);

    if (!isSticky) {

      if ($thisTab.is(':visible') === true) return;

      // Locate other tabs that share the same 'tabs-group'
      const tabsGroup = $thisTab.data('tabs-group');
      const $tabsGroup = this.$tabContents.filter(function () {
        return $(this).data('tabs-group') === tabsGroup;
      });

      // Disable other tabs in this group
      for (let i = 0; i < $tabsGroup.length; i++) {
        this.options.toggleContent($tabsGroup[i], false);
      }
      // Enable this tab content
      this.options.toggleContent($thisTab, true);
    } else {
      // Tabs are sticky, so we only toggle the individual item
      if ($thisTab.is(':visible') === true) {
        this.options.toggleContent($thisTab, false);
      } else {
        this.options.toggleContent($thisTab, true);
      }
    }
  }

  /* ----------------------------------------------------------------------- / 
    Miscellaneous: deal with initing the base tab state (say after resizing 
      the viewport or on page load) and event binding.
  */

  // Function to run when tabs are first init (sets one active over others)
  _init() {

    const hash = window.location.hash || this.defaultTab;
    console.log('the scurrent hash is:', hash);
    console.log('tab toggles length:', this.$tabToggles.length)

    // Disable all the tabs
    for (let i = 0; i < this.$tabToggles.length; i++) {
      console.log('tab toggles item:', this.$tabToggles.get(i))
      this.options.toggleTab(this.$tabToggles.get(i), false);
    }

    for (let i = 0; i < this.$tabContents.length; i++) {
      this.options.toggleContent(this.$tabContents.get(i), false);
    }

    this.options.toggleContent(hash, true);
    this.options.toggleTab(hash, true);

  }

  // Bind event handlers to the scope target.
  _bindEvents() {

    this.$scope.on('click', this.options.tabToggle, (event) => {
      event.preventDefault();

      const hash = $(event.target).attr('href');
      this.activateTab(hash);

      if (history.pushState) {
        if (this.options.tabHistory) {
          history.pushState({}, hash, hash);
        } else {
          history.replaceState({}, hash, hash);
        }
      } else {
        window.location.hash = tabId;
      }
    });

    $(window).on('hashchange', (event) => {
      this.activateTab(window.location.hash);
    });

  }
}
