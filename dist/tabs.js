'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _justDebounce = require('just-debounce');

var _justDebounce2 = _interopRequireDefault(_justDebounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tabs = function () {
  function Tabs(options) {
    _classCallCheck(this, Tabs);

    this.options = _jquery2.default.extend({

      // Scoping the tabs (event binding), link class, and content
      tabScope: '[data-tabs]',
      tabToggle: '[data-tab-link]',
      tabContent: '[data-tab-content]',
      toggleTab: this._defaultToggleTab,
      keepTabsOpen: this.keepTabsOpen,
      activeClass: 'active',
      defaultTab: '',
      afterSetup: function afterSetup() {},
      afterChange: function afterChange($element) {},
      tabHistory: false
    }, options);

    this.$scope = (0, _jquery2.default)(this.options.tabScope);
    this.$tabToggles = (0, _jquery2.default)(this.options.tabToggle);
    this.$tabContents = (0, _jquery2.default)(this.options.tabContent);

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


  _createClass(Tabs, [{
    key: '_defaultTab',
    value: function _defaultTab() {
      return this.$tabContents.first().attr('id');
    }

    // Default function to toggle a tab between active / inactive

  }, {
    key: '_defaultToggleTab',
    value: function _defaultToggleTab(element, active) {
      var $element = (0, _jquery2.default)(element);

      $element.toggleClass(this.activeClass, active);
    }
  }, {
    key: '_getTabStyle',
    value: function _getTabStyle() {
      var pseudoElem = window.getComputedStyle(this.$scope.get(0), ':before').content.replace(/"/g, '');
      return pseudoElem;
    }

    // Default function to toggle some content on or off

  }, {
    key: '_defaultToggleContent',
    value: function _defaultToggleContent(element, active) {
      var _this = this;

      var $element = (0, _jquery2.default)(element);

      if (active) {
        // Set the tab to active
        if (this.previousStyle === 'slide') {
          // show with a slidetoggle
          $element.slideDown('fast', function () {
            _this.options.afterChange($element);
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
          $element.slideUp('fast', function () {
            _this.options.afterChange($element);
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

  }, {
    key: 'keepTabsOpen',
    value: function keepTabsOpen() {
      return window.innerWidth < 800;
    }

    /* ----------------------------------------------------------------------- /
     Activation functions: Trigger the callbacks for showing / hiding tab
     components and links
     */

    // Set a particular tab as active (and optionally disable others)
    // This function is a wrapper for activating both the tab-link and
    // tab-content at the same time.

  }, {
    key: 'activateTab',
    value: function activateTab(hash, closeOthers) {

      // necessary to check for links that link to tabs that aren't available:
      if (!(0, _jquery2.default)(hash).length) {
        console.log('tab doesn\'t exist!');
        return;
      }

      var isSticky = closeOthers || this.options.keepTabsOpen();
      this.activateTabToggle(hash, isSticky);
      this.activateTabContent(hash, isSticky);
    }

    // Remove bc-tabs if content with tabs is updated, refreshed or replaced

  }, {
    key: 'unload',
    value: function unload() {
      this.$scope.off('.bc-tabs');
      (0, _jquery2.default)(window).off('.bc-tabs');
    }

    // Set a particular [data-tab-toggle] link as active,
    // and (optionally) deactivate others

  }, {
    key: 'activateTabToggle',
    value: function activateTabToggle(hash) {
      var isSticky = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      var $thisTab = (0, _jquery2.default)(hash);

      // Find tablinks that point to this hash
      var $tabLinks = this.$tabToggles.filter(function () {
        return (0, _jquery2.default)(this).attr('href') === hash;
      });

      if (!isSticky) {
        // Tab stickyness not active, target all other tabs in group

        if ($thisTab.is(':visible')) return;
        // Grab all the groups these links belong to
        var tabsGroups = [];
        $tabLinks.each(function () {
          var thisTabGroup = (0, _jquery2.default)(this).data('tabs-group');
          if (tabsGroups.indexOf(thisTabGroup) === -1) {
            tabsGroups.push(thisTabGroup);
          }
        });

        // Filter all the tabs to only those belonging to these groups
        var $tabsGroup = this.$tabToggles.filter(function () {
          return tabsGroups.indexOf((0, _jquery2.default)(this).data('tabs-group')) > -1;
        });

        // Disable all the tab links
        for (var i = 0; i < $tabsGroup.length; i++) {
          this.options.toggleTab($tabsGroup[i], false);
        }

        // Enable just the tab links associated with this hash
        for (var _i = 0; _i < $tabLinks.length; _i++) {
          this.options.toggleTab($tabLinks[_i], true);
        }
      } else {
        // Tabs are sticky, so we should only toggle items matching this hash
        if ($thisTab.is(':visible')) {
          // Enable just the tab links associated with this hash
          for (var _i2 = 0; _i2 < $tabLinks.length; _i2++) {
            this.options.toggleTab($tabLinks[_i2], false);
          }
        } else {
          for (var _i3 = 0; _i3 < $tabLinks.length; _i3++) {
            this.options.toggleTab($tabLinks[_i3], true);
          }
        }
      }
    }

    // Activate a content-element with the corresponding hash, and
    // (optionally) hide others in group

  }, {
    key: 'activateTabContent',
    value: function activateTabContent(hash) {
      var isSticky = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var $thisTab = (0, _jquery2.default)(hash);

      if (!isSticky) {

        if ($thisTab.is(':visible')) return;

        // Locate other tabs that share the same 'tabs-group'
        var tabsGroup = $thisTab.data('tabs-group');
        var $tabsGroup = this.$tabContents.filter(function () {
          return (0, _jquery2.default)(this).data('tabs-group') === tabsGroup;
        });

        // Disable other tabs in this group
        for (var i = 0; i < $tabsGroup.length; i++) {
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

  }, {
    key: '_init',
    value: function _init(checkStyleMatch) {
      if (checkStyleMatch) {
        var currentStyle = this._getTabStyle();

        if (this.previousStyle == currentStyle) {
          return;
        }

        this.previousStyle = currentStyle;
      }

      var hash = window.location.hash || '#' + this.defaultTab.id;
      var currentTab = hash ? 'a[href="' + hash + '"]' : '[data-tab-link]:first';

      // Disable all the tabs
      for (var i = 0; i < this.$tabToggles.length; i++) {
        this.options.toggleTab(this.$tabToggles.get(i), false);
      }

      for (var _i4 = 0; _i4 < this.$tabContents.length; _i4++) {
        this._defaultToggleContent(this.$tabContents.get(_i4), false);
      }

      this._defaultToggleContent(hash, true);
      this.options.toggleTab(currentTab, true);
    }

    // Bind event handlers to the scope target.

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$scope.on('click.bc-tabs', this.options.tabToggle, function (event) {
        event.preventDefault();
        var hash = (0, _jquery2.default)(event.target).attr('href');

        _this2.activateTab(hash);

        if (_this2.options.tabHistory) {
          history.pushState({}, hash, hash);
        } else {
          history.replaceState({}, hash, hash);
        }
      });

      (0, _jquery2.default)(window).on('hashchange.bc-tabs', function () {
        _this2.activateTab(window.location.hash);
      });

      (0, _jquery2.default)(window).on('resize.bc-tabs', (0, _justDebounce2.default)(function () {
        _this2._init(true);
      }, 300));
    }
  }]);

  return Tabs;
}();

exports.default = Tabs;
