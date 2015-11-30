(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _pin = require('./pin.js');

var _pin2 = _interopRequireDefault(_pin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PicklockGame = (function () {
  function PicklockGame() {
    _classCallCheck(this, PicklockGame);

    var self = this;
    this.canvas = document.getElementById('PicklockGame');
    this.context = this.canvas.getContext('2d');
    this.lastposition = {};
    this.pin = new _pin2.default();

    window.addEventListener('resize', function () {
      self.resizeCanvas();
    }, false);

    window.addEventListener('mousemove', function () {
      if (typeof self.lastposition.x != 'undefined' && !self.pin.twisting) {
        var deltaX = self.lastposition.x - event.offsetX,
            deltaY = self.lastposition.y - event.offsetY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
          self.pin.setPinPosition(-0.5);
        } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
          self.pin.setPinPosition(0.5);
        }
        self.pin.calculatetwistlimit();
      };
      self.lastposition = {
        x: event.offsetX,
        y: event.offsetY
      };
    }, false);

    window.addEventListener('mousedown', function () {
      self.pin.twisting = true;
    }, false);

    window.addEventListener('mouseup', function () {
      self.pin.twisting = false;
    }, false);

    this.resizeCanvas();
    this.frame();
  }

  _createClass(PicklockGame, [{
    key: 'resizeCanvas',
    value: function resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }, {
    key: 'frame',
    value: function frame() {
      var self = this;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.pin.twisting) {
        this.pin.twistlock();
      } else {
        this.pin.untwistlock();
      }
      this.drawlock();
      this.drawlockhole();
      this.drawpin();
      window.requestAnimationFrame(function () {
        self.frame();
      });
    }
  }, {
    key: 'drawlock',
    value: function drawlock() {
      this.context.save();
      this.context.beginPath();
      this.context.lineWidth = 0;
      this.context.arc(this.canvas.width / 2, this.canvas.height / 2, 100, 0, 2 * Math.PI, false);
      this.context.fillStyle = '#bdc3c7';
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
      this.context.restore();
    }
  }, {
    key: 'drawlockhole',
    value: function drawlockhole() {
      var percentage = this.pin.completed / 100;
      var degrees = percentage * 90.0;
      var radians = degrees * (Math.PI / 180);
      var x = this.canvas.width / 2;
      var y = this.canvas.height / 2;

      this.context.save();
      this.context.translate(x, y);
      this.context.rotate(radians);
      this.context.translate(-x, -y);
      this.context.fillRect(x, y, 4, 18);
      this.context.fillRect(x, y, 4, -18);
      this.context.fillRect(x, y, -4, 18);
      this.context.fillRect(x, y, -4, -18);
      this.context.restore();
    }
  }, {
    key: 'drawpin',
    value: function drawpin() {
      var offset = this.pin.vibrating ? 2 : 0;
      var percentage = (this.pin.point + offset) / 100;
      var degrees = (percentage + 0.5) * 180.0;
      var radians = degrees * (Math.PI / 180);
      var x = this.canvas.width / 2;
      var y = this.canvas.height / 2;

      this.context.save();
      this.context.translate(x, y);
      this.context.rotate(radians);
      this.context.translate(-x, -y);
      this.context.fillStyle = '#f1c40f';
      this.context.fillRect(x - 1, y, 4, 170);
      this.context.fillRect(x + 1, y, -4, 170);
      this.context.restore();
    }
  }]);

  return PicklockGame;
})();

new PicklockGame();

},{"./pin.js":3}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomHandler = (function () {
  function DomHandler() {
    _classCallCheck(this, DomHandler);

    this.innerpopout = document.querySelectorAll('.pop-stripe')[0];
    this.score = document.querySelectorAll('.score')[0];
  }

  _createClass(DomHandler, [{
    key: 'pop',
    value: function pop(message, color) {
      var self = this;
      this.popoutstart(message, color);
      setTimeout(function () {
        self.popoutend();
      }, 1000);
    }
  }, {
    key: 'popoutstart',
    value: function popoutstart(message, color) {
      this.innerpopout.style.background = color;
      this.innerpopout.textContent = message;
      this.innerpopout.classList.add('show');
    }
  }, {
    key: 'popoutend',
    value: function popoutend() {
      this.innerpopout.classList.remove('show');
    }
  }, {
    key: 'setscore',
    value: function setscore(lvl) {
      this.score.textContent = 'YOU\'VE PICKED ' + (lvl - 1) + ' LOCKS IN A ROW.';
    }
  }]);

  return DomHandler;
})();

exports.default = DomHandler;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _domhandler = require('./domhandler.js');

var _domhandler2 = _interopRequireDefault(_domhandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pin = (function () {
  function Pin() {
    var _this = this;

    _classCallCheck(this, Pin);

    var self = this;
    this.range = {
      min: 0,
      max: 100
    };
    this.level = 0;
    this.currentposition = 0;
    this.threshold = 0;
    this.point = 50;
    this.domhandler = new _domhandler2.default();
    this.limit = 0;
    this.twisting = false;
    this.vibrating = false;

    var _duration = 100;
    Object.defineProperty(this, 'duration', {
      get: function get() {
        return _duration;
      },
      set: function set(value) {
        _duration = value;

        if (_duration % 2 === 0) {
          self.vibrating = !self.vibrating;
        }
        if (!_duration) {
          _this.domhandler.pop("Pin broke!", "#c0392b");
          _this.resetLockpick(1);
        }
      }
    });

    var _completed = 0;
    Object.defineProperty(this, 'completed', {
      get: function get() {
        return _completed;
      },
      set: function set(value) {
        _completed = value;

        if (_completed === 100) {
          _this.domhandler.pop("Lock opened!", "#27af60");
          self.resetLockpick(self.level + 1);
        }
      }
    });

    this.duration = 100;
    this.completed = 0;

    this.resetLockpick(1);
  }

  _createClass(Pin, [{
    key: 'setPinPosition',
    value: function setPinPosition(value) {
      var valueadded = this.point + value;
      if (valueadded >= 0 && valueadded <= 100) {
        this.point = valueadded;
      }
    }
  }, {
    key: 'calculatetwistlimit',
    value: function calculatetwistlimit() {
      var pointrange = { min: this.currentposition - this.threshold, max: this.currentposition + this.threshold };
      if (this.point < pointrange.min) {
        this.limit = this.percentageprogress(this.point, this.range.min, pointrange.min);
      } else if (this.point > pointrange.max) {
        this.limit = this.percentageprogress(100 - this.point, 100 - pointrange.max, 0) * -1;
      } else {
        this.limit = 100;
      }
    }
  }, {
    key: 'percentageprogress',
    value: function percentageprogress(currentvalue, min, max) {
      return currentvalue / (max - min) * 100;
    }
  }, {
    key: 'twistlock',
    value: function twistlock() {
      if (this.completed < this.limit) {
        this.completed += 2;
        return;
      }
      if (this.completed < 100 && this.duration > 0) {
        this.duration -= 1;
      }
    }
  }, {
    key: 'untwistlock',
    value: function untwistlock() {
      if (this.completed > 0) {
        this.completed -= 2;
        this.vibrating = true;
      }
    }
  }, {
    key: 'resetLockpick',
    value: function resetLockpick(lvl) {
      this.level = lvl;
      this.threshold = 20 / this.level;
      this.currentposition = Math.floor(Math.random() * (this.range.max - this.range.min + 1)) + this.range.min;
      this.duration = 100;
      this.twisting = false;
      this.completed = 0;
      this.domhandler.setscore(this.level);
    }
  }]);

  return Pin;
})();

exports.default = Pin;

},{"./domhandler.js":2}]},{},[1])


//# sourceMappingURL=compiled.js.map
