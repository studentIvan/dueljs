duel = {};
duel.isLocalStorageAvailable = function () {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};
duel._DuelAbstractChannel = function () {};
duel._DuelAbstractChannel.prototype.getName = function () {
	return this._name
};
duel._DuelAbstractChannel.prototype._generateWindowID = function () {
	this._windowID = +Math.random().toString().split('.')[1];
	return this._windowID
};
duel._DuelAbstractChannel.prototype.getWindowID = function () {
	return this._windowID ? this._windowID : this._generateWindowID()
};
duel._DuelAbstractChannel.prototype.setCurrentWindowAsMaster = function () {};
duel._DuelAbstractChannel.prototype.currentWindowIsMaster = function () {
	return true
};
duel._DuelLocalStorageChannel = function (name) {
	this._name = name;
	this.setCurrentWindowAsMaster();
};
duel._DuelLocalStorageChannel.prototype = duel._DuelAbstractChannel.prototype;
duel._DuelLocalStorageChannel.prototype.setCurrentWindowAsMaster = function () {
	var i, len, ch, wIndex, wID = this.getWindowID(), chName = 'dueljs_channel_' + this._name;
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
		localStorage.setItem(chName, JSON.stringify([{id: wID, master: true}]))
	}
};
duel._DuelLocalStorageChannel.prototype.currentWindowIsMaster = function () {
	var i, len, ch, wIndex, wID = this.getWindowID(), chName = 'dueljs_channel_' + this._name;
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
duel._DuelFakeChannel = function (name) {
	this.name = name;
};
duel._DuelFakeChannel.prototype = duel._DuelAbstractChannel.prototype;
duel._channels = [];
duel.channel = function (name) {
	var channel = this.isLocalStorageAvailable() 
		? new this._DuelLocalStorageChannel(name) : new this._DuelFakeChannel(name);
	duel._channels.push(channel);
	return channel
};
duel.makeCurrentWindowMaster = function () {
	for (var i = duel._channels.length - 1; i >= 0; i--) {
		try {
			duel._channels[i].setCurrentWindowAsMaster()
		} catch (e) {

		}
	}
};
window.onfocus = function () { 
	duel.makeCurrentWindowMaster()
};
window.isMaster = function () {
	return duel._channels[duel._channels.length - 1].currentWindowIsMaster()
};
if (document.addEventListener) {
	document.addEventListener("visibilitychange", function () {
		if (!document.hidden) {
			duel.makeCurrentWindowMaster()
		}
	})
}