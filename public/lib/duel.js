/*!
 * DuelJS JavaScript Library v1.1.0
 * https://github.com/studentIvan/dueljs
 *
 * Copyright 2015 Maslov Ivan
 * Released under the MIT license
 * https://raw.githubusercontent.com/studentIvan/dueljs/master/LICENSE
 */

duel = {};

/**
 * Optional configuration
 * Storage event improves performance in modern browsers
 * See list of attested browsers in README.md
 * default: true (IE - false)
 * @type {boolean}
 */
duel.useStorageEvent = !/trident|MSIE/i.test(navigator.userAgent);

/**
 * Common function for localStorage detection
 * @returns {boolean}
 */
duel.isLocalStorageAvailable = function () {
    try {
        return 'localStorage' in window
            && window['localStorage'] !== null && window['localStorage'] !== undefined;
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
    var DuelAbstractChannel = function () {
    };

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
    DuelAbstractChannel.prototype.emit = function (trigger) {
        this.broadcast(trigger);
    };

    /**
     *
     * @param {{name: string, args: []}} triggerDetails
     */
    DuelAbstractChannel.prototype.executeTrigger = function (triggerDetails) {
        if (!this.currentWindowIsMaster()) {
            try {
                if (this._triggers[triggerDetails.name] instanceof Array) {
                    this._triggers[triggerDetails.name][0].apply(this, triggerDetails.args);
                    delete this._triggers[triggerDetails.name];
                } else {
                    this._triggers[triggerDetails.name].apply(this, triggerDetails.args);
                }
            } catch (e) {}
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
        try { delete this._triggers[trigger]; } catch (e) {}
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
    var i, len, ch, wIndex, wID = duel.getWindowID(), chName = 'dueljs_channel_' + this.getName();
    if (ch = localStorage.getItem(chName)) {
        for (ch = JSON.parse(ch), wIndex = -1, i = 0, len = ch.length; i < len; i++) {
            ch[i].master = false;
            if (ch[i].id === wID) {
                wIndex = i
            }
        }
        if (wIndex === -1) {
            ch.push({id: wID, master: true})
        } else {
            ch[wIndex].master = true
        }
        localStorage.setItem(chName, JSON.stringify(ch));
    } else {
        localStorage.setItem(chName, JSON.stringify([
            {id: wID, master: true}
        ]));
    }
    return true;
};

/**
 * Check current tab in this channel is master or not
 * @returns {boolean}
 */
duel.DuelLocalStorageChannel.prototype.currentWindowIsMaster = function () {
    var i, len, ch, wIndex, wID = duel.getWindowID(), chName = 'dueljs_channel_' + this.getName();
    if (ch = localStorage.getItem(chName)) {
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
        localStorage.setItem('dueljs_trigger', JSON.stringify({
            channelName: this.getName(),
            triggerDetails: {
                name: trigger,
                args: Array.prototype.slice.call(arguments, 1)
            }
        }));
        // broadcast that something happened
        localStorage.setItem('dueljs_trigger_event_key', +Math.random().toString().split('.')[1]);
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
    console.error('DuelJS warning: instanceof DuelFakeChannel was created, ' +
        'check the localStorage support in your browser');
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
    var channel = this.isLocalStorageAvailable()
        ? new this.DuelLocalStorageChannel(name) : new this.DuelFakeChannel(name);
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
        duel.activeChannels[0].currentWindowIsMaster() : false;
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
    duel.storageOldTriggerValue = localStorage.getItem('dueljs_trigger_event_key');
    if (duel.useStorageEvent) {
        /**
         * Callback doesn't work in the master window
         * See html5 storage event documentation
         */
        duel.addEvent(window, 'storage', function (e) {
            var event = e || event || window.event;
            if (event.key == 'dueljs_trigger_event_key' && event.newValue != duel.storageOldTriggerValue) {
                duel.storageOldTriggerValue = localStorage.getItem('dueljs_trigger_event_key');
                duel.storageEvent({
                    key: 'dueljs_trigger',
                    newValue: localStorage.getItem('dueljs_trigger')
                });
            }
        });
    } else {
        setInterval(function () {
            if (localStorage.getItem('dueljs_trigger_event_key') != duel.storageOldTriggerValue) {
                duel.storageOldTriggerValue = localStorage.getItem('dueljs_trigger_event_key');
                duel.storageEvent({
                    key: 'dueljs_trigger',
                    newValue: localStorage.getItem('dueljs_trigger')
                });
            }
        }, 100);
    }
 }
