/*!
 * TabNinja JavaScript Library v0.0.1-w
 * https://github.com/studentIvan/tabninja
 *
 * Copyright 2015 Maslov Ivan
 * Released under the MIT license
 * https://raw.githubusercontent.com/studentIvan/tabninja/master/LICENSE
 */

tabNinja = {};

/**
 * Common function for localStorage detection
 * @returns {boolean}
 */
tabNinja.isLocalStorageAvailable = function () {
    try {
        return 'localStorage' in window
            && window['localStorage'] !== null && window['localStorage'] !== undefined;
    } catch (e) {
        return false;
    }
};

/**
 * Cross-browser addEvent method
 */
tabNinja.addEvent = (function () {
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
 * LocalStorage indicator
 * @type {boolean}
 */
tabNinja.localStorageAvailable = tabNinja.isLocalStorageAvailable();
/**
 * Ninja name
 * @type {number}
 */
tabNinja.ninjaName = -1;

if (tabNinja.localStorageAvailable) {
    if (!sessionStorage.getItem('tabninja:here')) {
        sessionStorage.setItem('tabninja:here', 'yes');
        localStorage.setItem('tabninja:stack', '');
    }
}

/**
 * The function returns a ninja state of current tab
 * @returns {boolean}
 */
tabNinja.isSuperMaster = function () {
    if (!tabNinja.localStorageAvailable) {
        return true;
    }

    try {
        var ninjaStack = JSON.parse(localStorage.getItem('tabninja:stack'));
        if (tabNinja.ninjaName === -1) {
            tabNinja.ninjaName = +Math.max.apply(0, ninjaStack) + 1;
        }
        if (ninjaStack.indexOf(tabNinja.ninjaName) === -1) {
            ninjaStack.push(tabNinja.ninjaName);
            localStorage.setItem('tabninja:stack', JSON.stringify(ninjaStack));
            return false;
        } else {
            return (ninjaStack.indexOf(tabNinja.ninjaName) === 0);
        }
    } catch (e) {
        tabNinja.ninjaName = 1;
        localStorage.setItem('tabninja:stack', '[1]');
        return true;
    }
};

/**
 * Void for unload
 */
tabNinja.killCurrentNinja = function () {
    localStorage.setItem('tabninja:unloaded', 1);
    try {
        var ninjaStack = JSON.parse(localStorage.getItem('tabninja:stack'));
        ninjaStack.splice(ninjaStack.indexOf(tabNinja.ninjaName), 1);
        if (ninjaStack.length > 0) {
            localStorage.setItem('tabninja:stack', JSON.stringify(ninjaStack));
        } else {
            localStorage.setItem('tabninja:stack', '');
        }
    } catch (e) {
        localStorage.setItem('tabninja:stack', '');
    }
};

tabNinja.isSuperMaster();
window.isSuperMaster = tabNinja.isSuperMaster;
tabNinja.addEvent(window, 'unload', tabNinja.killCurrentNinja);