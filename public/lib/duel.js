/*!
 * DuelJS JavaScript Library v1.2.7
 * https://github.com/studentIvan/dueljs
 * http://dueljs.readthedocs.org/en/latest/
 *
 * Copyright 2015-2016 Maslov Ivan
 * Released under the MIT license
 * https://raw.githubusercontent.com/studentIvan/dueljs/master/LICENSE
 */
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      // Use globals variables in case that they are undefined locally
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    // Note. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(root);
  } else {
    // Browser globals
    root.duel = factory(root);
  }
}(typeof window !== "undefined" ? window : this, function (window) {
  var duel = {};

  /**
   * Optional configuration
   * Storage event improves performance in modern browsers
   * See list of attested browsers in README.md
   * default: true (IE - false)
   * @type {boolean}
   */
  duel.useStorageEvent = !/trident|MSIE/i.test(navigator.userAgent);

  /**
   * Turn off dueljs warnings
   * default: true
   * @type {boolean}
   */
  duel.noWarnings = true;

  /**
   * Common function for localStorage detection
   * @returns {boolean}
   */
  duel.isLocalStorageAvailable = function () {
    try {
      var hasStorage = typeof localStorage !== 'undefined' && ('setItem' in localStorage) && localStorage.setItem;
      if (!hasStorage) {
        return false;
      }

      var uid = new Date;
      localStorage.setItem(uid, uid);
      localStorage.removeItem(uid);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * Common function for copy objects
   * @param obj
   * @returns {*}
   */
  duel.clone = function (obj) {
    var copy;

    if (null == obj || "object" != typeof obj) return obj;

    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = duel.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  };

  /**
   * @abstract
   */
  duel.DuelAbstractChannel = (function () {
    /**
     * @constructor
     */
    var DuelAbstractChannel = function () {};

    /**
     * @returns {string}
     */
    DuelAbstractChannel.prototype.getName = function () {
      return this._name;
    };

    /**
     * @returns {boolean}
     */
    DuelAbstractChannel.prototype.setCurrentWindowAsMaster = function () {
      return true;
    };

    /**
     * @returns {boolean}
     */
    DuelAbstractChannel.prototype.currentWindowIsMaster = function () {
      return true;
    };

    /**
     * Only master can sends broadcast
     * @param {string} trigger
     */
    DuelAbstractChannel.prototype.broadcast = function (trigger) {
      if (this.currentWindowIsMaster()) {
        this.executeTrigger({
          name: trigger,
          args: Array.prototype.slice.call(arguments, 1)
        });
      }
    };

    /**
     * Alias of broadcast
     * @param {string} trigger
     */
    DuelAbstractChannel.prototype.emit = function () {
      this.broadcast.apply(this, arguments);
    };

    /**
     * Get storage variable content
     * @param  {string} varName
     * @return {object|string|number|boolean} value
     */
    DuelAbstractChannel.prototype.getItem = function (varName) {
      varName += ':dueljs:variable:' + this.getName();
      return this.__storage ? ((typeof angular == "object") ? angular.fromJson(this.__storage.getItem(varName)) : JSON.parse(this.__storage.getItem(varName), true)) : null;
    };

    /**
     * Set storage variable content
     * @param {string} varName
     * @param {object|string|number|boolean} value
     */
    DuelAbstractChannel.prototype.setItem = function (varName, value) {
      if (this.__storage) {
        varName += ':dueljs:variable:' + this.getName();
        this.__storage.setItem(varName, (typeof angular == "object") ? angular.toJson(value) : JSON.stringify(value));
      }
    };

    /**
     * Remove storage variable
     * @param {string} varName
     */
    DuelAbstractChannel.prototype.removeItem = function (varName) {
      if (this.__storage) {
        varName += ':dueljs:variable:' + this.getName();
        this.__storage.removeItem(varName);
      }
    };

    /**
     *
     * @param {{name: string, args: []}} triggerDetails
     * @param {boolean} force
     */
    DuelAbstractChannel.prototype.executeTrigger = function (triggerDetails, force) {
      force = force || false;
      if (!(triggerDetails instanceof Object)) {
        throw "triggerDetails should be an Object";
      }
      if (!this.currentWindowIsMaster() || force) {
        try {
          if (this._triggers[triggerDetails.name] instanceof Array) {
            this._triggers[triggerDetails.name][0].apply(this, triggerDetails.args);
            delete this._triggers[triggerDetails.name];
          } else {
            this._triggers[triggerDetails.name].apply(this, triggerDetails.args);
          }
        } catch (e) {
          if (!duel.noWarnings) {
            if (typeof angular == 'object') {
              console.warn('DuelJS caught exception, maybe you didn\'t know that the functions inside the dueljs events use a their own scopes', e);
            } else {
              console.warn('DuelJS caught exception', e);
            }
          }
        }
      }
    };

    /**
     * @param {string} trigger
     * @param {function|[]} callback
     */
    DuelAbstractChannel.prototype.on = function (trigger, callback) {
      if (!this._triggers) {
        /**
         * @type {{}}
         * @private
         */
        this._triggers = {};
      }

      this._triggers[trigger] = callback;
    };

    /**
     * @param {string} trigger
     * @param {function} callback
     */
    DuelAbstractChannel.prototype.once = function (trigger, callback) {
      this.on(trigger, [callback]);
    };

    /**
     * @param {string} trigger
     */
    DuelAbstractChannel.prototype.off = function (trigger) {
      try {
        delete this._triggers[trigger];
      } catch (e) {}
    };

    return DuelAbstractChannel
  })();

  /**
   * @returns {number}
   * @private
   */
  duel._generateWindowID = function () {
    this._windowID = +Math.random().toString().split('.')[1];
    return this._windowID;
  };

  /**
   * Get unique tab ID
   * @returns {number}
   */
  duel.getWindowID = function () {
    return this._windowID ? this._windowID : this._generateWindowID();
  };

  /**
   * @param {string} name
   * @constructor
   */
  duel.DuelLocalStorageChannel = function (name) {
    /**
     * Name of current channel
     * @type {string}
     * @private
     */
    this._name = name;
    this.__storage = window.localStorage;
    this.setCurrentWindowAsMaster();
  };

  /**
   * @type {Object|Function|DuelAbstractChannel}
   */
  duel.DuelLocalStorageChannel.prototype = duel.clone(duel.DuelAbstractChannel.prototype);

  /**
   * Makes current tab as master tab
   * @returns {boolean}
   */
  duel.DuelLocalStorageChannel.prototype.setCurrentWindowAsMaster = function () {
    var i, len, ch, wIndex, wID = duel.getWindowID(),
      chName = 'dueljs_channel_' + this.getName();
    if (ch = this.__storage.getItem(chName)) {
      for (ch = JSON.parse(ch), wIndex = -1, i = 0, len = ch.length; i < len; i++) {
        ch[i].master = false;
        if (ch[i].id === wID) {
          wIndex = i
        }
      }
      if (wIndex === -1) {
        ch.push({
          id: wID,
          master: true
        })
      } else {
        ch[wIndex].master = true
      }
      this.__storage.setItem(chName, JSON.stringify(ch));
    } else {
      this.__storage.setItem(chName, JSON.stringify([{
        id: wID,
        master: true
      }]));
    }
    return true;
  };

  /**
   * Check current tab in this channel is master or not
   * @returns {boolean}
   */
  duel.DuelLocalStorageChannel.prototype.currentWindowIsMaster = function () {
    var i, len, ch, wIndex, wID = duel.getWindowID(),
      chName = 'dueljs_channel_' + this.getName();
    if (ch = this.__storage.getItem(chName)) {
      for (ch = JSON.parse(ch), wIndex = -1, i = 0, len = ch.length; i < len; i++) {
        if (ch[i].id === wID) {
          wIndex = i;
          break;
        }
      }
      return (wIndex === -1) ? false : ch[wIndex].master;
    } else {
      return false;
    }
  };

  /**
   * Only master can sends broadcast
   */
  duel.DuelLocalStorageChannel.prototype.broadcast = function (trigger) {
    if (this.currentWindowIsMaster()) {
      // broadcast new task
      this.__storage.setItem('dueljs_trigger', JSON.stringify({
        channelName: this.getName(),
        triggerDetails: {
          name: trigger,
          args: Array.prototype.slice.call(arguments, 1)
        }
      }));
      // broadcast that something happened
      this.__storage.setItem('dueljs_trigger_event_key', +Math.random().toString().split('.')[1]);
    }
  };

  /**
   * @param {string} name
   * @constructor
   */
  duel.DuelFakeChannel = function (name) {
    /**
     * Name of current channel
     * @type {string}
     * @private
     */
    this._name = name;
    if (!duel.noWarnings) {
      console.error('DuelJS warning: instanceof DuelFakeChannel was created, ' +
        'check the localStorage support in your browser');
    }
  };

  /**
   * @type {Object|Function|DuelAbstractChannel}
   */
  duel.DuelFakeChannel.prototype = duel.clone(duel.DuelAbstractChannel.prototype);

  /**
   * @type {Array}
   */
  duel.activeChannels = [];

  /**
   * Create new channel
   * @param name
   * @returns {duel.DuelLocalStorageChannel}
   */
  duel.channel = function (name) {
    for (var chID in duel.activeChannels) {
      if (duel.activeChannels.hasOwnProperty(chID) &&
        duel.activeChannels[chID].getName() == name) {
        return duel.activeChannels[chID];
      }
    }
    var channel = this.isLocalStorageAvailable() ? new this.DuelLocalStorageChannel(name) : new this.DuelFakeChannel(name);
    duel.activeChannels.push(channel);
    return channel;
  };

  /**
   * Take the all channels in current window and
   * set current window as master for all of them
   */
  duel.makeCurrentWindowMaster = function () {
    for (var i = duel.activeChannels.length - 1; i >= 0; i--) {
      try {
        duel.activeChannels[i].setCurrentWindowAsMaster();
      } catch (e) {
        // stop to exceptions
      }
    }
  };

  /**
   * Makes tab focus trigger for special browsers
   */
  window.onfocus = function () {
    duel.makeCurrentWindowMaster();
  };

  /**
   * Take first channel in current window and check is it master or not
   * @returns {boolean}
   */
  window.isMaster = function () {
    return duel.activeChannels.length ?
      duel.activeChannels[0].currentWindowIsMaster() : true;
  };

  /**
   * Cross-browser addEvent method
   */
  duel.addEvent = (function () {
    if (document.addEventListener) {
      return function (el, type, fn) {
        if (el && el.nodeName || el === window) {
          el.addEventListener(type, fn, false);
        } else if (el && el.length) {
          for (var i = 0; i < el.length; i++) {
            addEvent(el[i], type, fn);
          }
        }
      };
    } else {
      return function (el, type, fn) {
        if (el && el.nodeName || el === window) {
          el.attachEvent('on' + type, function () {
            return fn.call(el, window.event);
          });
        } else if (el && el.length) {
          for (var i = 0; i < el.length; i++) {
            addEvent(el[i], type, fn);
          }
        }
      };
    }
  })();

  /**
   * Makes tab focus trigger for modern browsers (more correctly)
   */
  duel.addEvent(window, 'visibilitychange', function () {
    if (!document.hidden) {
      duel.makeCurrentWindowMaster();
    }
  });

  /**
   * @param event
   */
  duel.storageEvent = function (event) {
    if (event.key == 'dueljs_trigger') {
      /**
       * @type {{channelName: string, triggerDetails: {name: string, args: []}}}
       */
      var eventDetails = JSON.parse(event.newValue);
      for (var i = duel.activeChannels.length - 1; i >= 0; i--) {
        try {
          if (duel.activeChannels[i].getName() == eventDetails.channelName) {
            duel.activeChannels[i].executeTrigger(eventDetails.triggerDetails);
          }
        } catch (e) {
          // stop to exceptions
        }
      }
    }
  };

  /**
   * Broadcast events engine
   */
  if (duel.isLocalStorageAvailable()) {
    duel.storageOldTriggerValue = window.localStorage.getItem('dueljs_trigger_event_key');
    if (duel.useStorageEvent) {
      /**
       * Callback doesn't work in the master window
       * See html5 storage event documentation
       */
      duel.addEvent(window, 'storage', function (e) {
        var event = e || event || window.event;
        if (event.key == 'dueljs_trigger_event_key' && event.newValue != duel.storageOldTriggerValue) {
          duel.storageOldTriggerValue = window.localStorage.getItem('dueljs_trigger_event_key');
          duel.storageEvent({
            key: 'dueljs_trigger',
            newValue: window.localStorage.getItem('dueljs_trigger')
          });
        }
      });
    } else {
      setInterval(function () {
        if (window.localStorage.getItem('dueljs_trigger_event_key') != duel.storageOldTriggerValue) {
          duel.storageOldTriggerValue = window.localStorage.getItem('dueljs_trigger_event_key');
          duel.storageEvent({
            key: 'dueljs_trigger',
            newValue: window.localStorage.getItem('dueljs_trigger')
          });
        }
      }, 100);
    }
    duel.addEvent(window, 'unload', function () {
      var wID = duel.getWindowID(),
        ch, len, i, j, chName, wIndex;
      for (i = duel.activeChannels.length - 1; i >= 0; i--) {
        try {
          chName = 'dueljs_channel_' + duel.activeChannels[i].getName();
          if (ch = window.localStorage.getItem(chName)) {
            for (ch = JSON.parse(ch), wIndex = -1, j = 0, len = ch.length; j < len; j++) {
              if (ch[j].id === wID) {
                if (ch[j].master) {
                  ch[j].master = false;
                  ch[0].master = true;
                }
                ch.splice(j, 1);
                window.localStorage.setItem(chName, JSON.stringify(ch));
                break;
              }
            }
          }
        } catch (e) {
          // stop to exceptions
        }
      }
    });
  }

  return duel;
}));
