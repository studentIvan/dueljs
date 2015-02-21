/*!
 * TabNinja JavaScript Library v0.0.1
 * https://github.com/studentIvan/tabninja
 *
 * Copyright 2015 Maslov Ivan
 * Released under the MIT license
 * https://raw.githubusercontent.com/studentIvan/tabninja/master/LICENSE
 */

duel.tabNinja = {};

/**
 * LocalStorage indicator
 * @type {boolean}
 */
duel.tabNinja.localStorageAvailable = duel.isLocalStorageAvailable();
/**
 * Ninja name
 * @type {number}
 */
duel.tabNinja.ninjaName = -1;

if (duel.tabNinja.localStorageAvailable) {
    if (!sessionStorage.getItem('tabninja:here')) {
        sessionStorage.setItem('tabninja:here', 'yes');
        localStorage.setItem('tabninja:stack', '');
    }
}

/**
 * The function returns a ninja state of current tab
 * @returns {boolean}
 */
duel.tabNinja.isSuperMaster = function () {
    if (!duel.tabNinja.localStorageAvailable) {
        return true;
    }

    try {
        var ninjaStack = JSON.parse(localStorage.getItem('tabninja:stack'));
        if (duel.tabNinja.ninjaName === -1) {
            duel.tabNinja.ninjaName = +Math.max.apply(0, ninjaStack) + 1;
        }
        if (ninjaStack.indexOf(duel.tabNinja.ninjaName) === -1) {
            ninjaStack.push(duel.tabNinja.ninjaName);
            localStorage.setItem('tabninja:stack', JSON.stringify(ninjaStack));
            return false;
        } else {
            return (ninjaStack.indexOf(duel.tabNinja.ninjaName) === 0);
        }
    } catch (e) {
        duel.tabNinja.ninjaName = 1;
        localStorage.setItem('tabninja:stack', '[1]');
        return true;
    }
};

/**
 * Void for unload
 */
duel.tabNinja.killCurrentNinja = function () {
    localStorage.setItem('tabninja:unloaded', 1);
    try {
        var ninjaStack = JSON.parse(localStorage.getItem('tabninja:stack'));
        ninjaStack.splice(ninjaStack.indexOf(duel.tabNinja.ninjaName), 1);
        if (ninjaStack.length > 0) {
            localStorage.setItem('tabninja:stack', JSON.stringify(ninjaStack));
        } else {
            localStorage.setItem('tabninja:stack', '');
        }
    } catch (e) {
        localStorage.setItem('tabninja:stack', '');
    }
};

duel.tabNinja.isSuperMaster();
window.isSuperMaster = duel.tabNinja.isSuperMaster;
duel.addEvent(window, 'unload', duel.tabNinja.killCurrentNinja);