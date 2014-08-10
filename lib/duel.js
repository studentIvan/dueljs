/*!
 * DuelJS JavaScript Library v1.0.0
 * https://github.com/studentIvan/dueljs
 *
 * Copyright 2014 Maslov Ivan
 * Released under the MIT license
 * https://raw.githubusercontent.com/studentIvan/dueljs/master/LICENSE
 */

duel = {};

/**
 * Common function for localStorage detection
 * @returns {boolean}
 */
duel.isLocalStorageAvailable = function () {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

/**
 * @abstract
 * @private
 */
duel._DuelAbstractChannel = (function () {
    /**
     * @constructor
     */
    var DuelAbstractChannel = function () {
    };

    /**
     * @returns {string}
     */
    DuelAbstractChannel.prototype.getName = function () {
        return this._name
    };

    /**
     * @returns {boolean}
     */
    DuelAbstractChannel.prototype.setCurrentWindowAsMaster = function () {
        return true
    };

    /**
     * @returns {boolean}
     */
    DuelAbstractChannel.prototype.currentWindowIsMaster = function () {
        return true
    };

    return DuelAbstractChannel
})();

/**
 * @returns {number}
 * @private
 */
duel._generateWindowID = function () {
    this._windowID = +Math.random().toString().split('.')[1];
    return this._windowID
};

/**
 * Get unique tab ID
 * @returns {number}
 */
duel.getWindowID = function () {
    return this._windowID ? this._windowID : this._generateWindowID()
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
 * @type {Object|Function|_DuelAbstractChannel}
 */
duel.DuelLocalStorageChannel.prototype = duel._DuelAbstractChannel.prototype;

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
        localStorage.setItem(chName, JSON.stringify(ch))
    } else {
        localStorage.setItem(chName, JSON.stringify([
            {id: wID, master: true}
        ]))
    }
    return true
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
        return (wIndex === -1) ? false : ch[wIndex].master
    } else {
        return false
    }
};

/**
 *
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
};

/**
 * @type {Object|Function|_DuelAbstractChannel}
 */
duel.DuelFakeChannel.prototype = duel._DuelAbstractChannel.prototype;

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
    var channel = this.isLocalStorageAvailable()
        ? new this.DuelLocalStorageChannel(name) : new this.DuelFakeChannel(name);
    duel.activeChannels.push(channel);
    return channel
};

/**
 * Take the all channels in current window and
 * set current window as master for all of them
 */
duel.makeCurrentWindowMaster = function () {
    for (var i = duel.activeChannels.length - 1; i >= 0; i--) {
        try {
            duel.activeChannels[i].setCurrentWindowAsMaster()
        } catch (e) {
            // stop to exceptions
        }
    }
};

/**
 * Makes tab focus trigger for special browsers
 */
window.onfocus = function () {
    duel.makeCurrentWindowMaster()
};

/**
 * Take first channel in current window and check is it master or not
 * @returns {boolean}
 */
window.isMaster = function () {
    return duel.activeChannels.length ?
        duel.activeChannels[0].currentWindowIsMaster() : false
};

/**
 * Makes tab focus trigger for modern browsers (more correctly)
 */
if (document.addEventListener) {
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            duel.makeCurrentWindowMaster()
        }
    })
}