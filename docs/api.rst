API:duel
========

duel
----
Main global object.

* global
* type: object

duel.activeChannels
-------------------
Collect inside all active channels.

* public
* type: array
* default: []

duel.useStorageEvent
--------------------
Optional configuration. Storage event improves performance in modern browsers.

* public
* type: boolean
* default: true (IE - false)

duel.noWarnings
---------------
Optional configuration. You can turn it to false for debug.

* public
* type: boolean
* default: true

duel.isLocalStorageAvailable()
------------------------------
Common function for localStorage detection.

* public
* type: function
* returns: boolean

duel.channel(name:string)
-------------------------
Creates a new channel or join to existed.
Hint: a = duel.channel('x') and b = duel.channel('x') will be linking on ONE object.

* public
* type: function
* returns: object (duel.DuelAbstractChannel inheritor)

duel.makeCurrentWindowMaster()
------------------------------
Take the all channels in current window and set current window as master for all of them.

* public
* type: function

duel.clone(obj:object)
----------------------
Common function for copy objects.

* public
* type: function
* returns: object
* throws error on unsupported type

duel._generateWindowID()
------------------------
Generates, sets up and returns new window/tab ID.

* private
* type: function
* returns: number

duel.getWindowID()
------------------
Get unique window/tab ID.

* public
* type: function
* returns: number

duel.addEvent(el:object, type:string, fn:function)
--------------------------------------------------
Cross-browser addEvent method.

* public
* type: function

duel.storageEvent(event:object)
-------------------------------
Finds the specific channel and execute event on it. **event** object contains **key:string** and **newValue:string**.
**newValue** is a JSON string, which contains **channelName:string** and **triggerDetails:object**.
**triggerDetails** contains **name:string** and **args:array**.

* public
* type: function

duel.DuelAbstractChannel
------------------------
Abstract class for possible duel channels. DuelJS probably will support another channels besides **duel.DuelLocalStorageChannel** in future.

* abstract
* type: function
* returns: object

duel.DuelLocalStorageChannel
----------------------------
Channel class for work with localStorage.

* abstract
* type: function
* returns: object

duel.DuelFakeChannel
--------------------
Channel class for work without localStorage.

* abstract
* type: function
* returns: object

window.isMaster()
-----------------
Take first channel in current window and check is it master or not

Standard window object spreading method.
Looks like syntax sugar for channelObject.currentWindowIsMaster()

* public
* type: function
* returns: boolean

