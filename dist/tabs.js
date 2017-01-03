'use strict';
'format es6';
// Required for JSPM to understand module format

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tabs = function () {
  function Tabs(options) {
    _classCallCheck(this, Tabs);

    this.options = _jquery2.default.extend({
      moduleSelector: (0, _jquery2.default)('[data-tabs]'),
      titleSelector: (0, _jquery2.default)('.tab-title'),
      activeClass: 'active',
      afterSetup: function afterSetup() {},
      afterChange: function afterChange() {},
      tabHistory: false
    }, options);

    this.$el = this.options.moduleSelector;

    this._init();
    this._bindEvents();
  }

  _createClass(Tabs, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      var hash = window.location.hash;

      // Loop through each tab UI
      this.$el.each(function (idx, el) {
        var $tabUI = (0, _jquery2.default)(el);
        var $activeTab = $tabUI.find(_this.options.titleSelector).first().find('a');
        var $activeTabPanel = (0, _jquery2.default)($activeTab.attr('href'));
        var $inactiveTabPanels = $activeTabPanel.siblings();

        if (hash) {
          // Check if hash is a match to one of the tab panel IDs
          // If it is, make that panel active instead
          $inactiveTabPanels.each(function (idx, el) {
            var tabId = '#' + (0, _jquery2.default)(el).attr('id');

            if (tabId == hash) {
              $activeTab = _this.$el.find('a[href="' + tabId + '"]');
              $activeTabPanel = (0, _jquery2.default)(tabId);
            }
          });
        }

        // Add active class to tab and panel
        $activeTab.parent().addClass(_this.options.activeClass);
        $activeTabPanel.addClass(_this.options.activeClass);

        // afterSetup callback
        _this.options.afterSetup($activeTab.attr('href'));
      });
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$el.on('click', this.options.titleSelector.selector + ' a', function (e) {
        e.preventDefault();
        var $target = (0, _jquery2.default)(e.currentTarget);
        var tabId = $target.attr('href');
        _this2._toggleClasses($target.parent());
        _this2.displayTabContent(tabId);

        if (history.pushState) {
          if (_this2.options.tabHistory) {
            history.pushState({}, tabId, tabId);
          } else {
            history.replaceState({}, tabId, tabId);
          }
        } else {
          window.location.hash = tabId;
        }
      });

      (0, _jquery2.default)(window).on('hashchange', function (e) {
        var hash = window.location.hash;

        _this2.displayTabContent(hash);
      });
    }

    // Update the tab navigation "active" state.

  }, {
    key: '_updateTabNav',
    value: function _updateTabNav(tabId) {
      var hrefSelector = '[href="' + tabId + '"]';
      var $navItem = this.options.titleSelector.find(hrefSelector);

      this.options.titleSelector.removeClass(this.options.activeClass);
      this._toggleClasses($navItem.parent());
    }

    // Update the tab content "active" state (showing the tab).

  }, {
    key: 'displayTabContent',
    value: function displayTabContent(tabId) {
      this._toggleClasses((0, _jquery2.default)(tabId));

      this._updateTabNav(tabId);

      this.options.afterChange(tabId);
    }

    // Swap the active state on while turning off any siblings.

  }, {
    key: '_toggleClasses',
    value: function _toggleClasses($el) {
      $el.addClass(this.options.activeClass).siblings().removeClass(this.options.activeClass);
    }
  }]);

  return Tabs;
}();

exports.default = Tabs;
