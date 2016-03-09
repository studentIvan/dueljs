API:channel object interface
============================

channel.getItem(varName:string)
-------------------------------
Get jsonify var content from storage.

* public
* type: function
* returns: mixed

channel.setItem(varName:string, value:mixed)
--------------------------------------------
Set storage variable content.

* public
* type: function

channel.removeItem(varName:string)
----------------------------------
Remove var from storage.

* public
* type: function

channel.getName()
-----------------
Returns the name of this channel.

* public
* type: function
* returns: string

channel.setCurrentWindowAsMaster()
----------------------------------
Makes current window/tab as master in this channel.

* public
* type: function
* returns: boolean

channel.currentWindowIsMaster()
-------------------------------
Checks the master state of this channel.

* public
* type: function
* returns: boolean

channel.broadcast(trigger:string[, arguments:arguments])
--------------------------------------------------------
Emits broadcasting. Hint: only master can sends broadcast.

* public
* type: function

channel.emit(trigger:string[, arguments:arguments])
---------------------------------------------------
Alias of **channel.broadcast**

channel.executeTrigger(triggerDetails:object[, force:boolean])
--------------------------------------------------------------
Executes pointed trigger. **triggerDetails** contains **name:string** and **args:array**

* public
* type: function
* throws error if triggerDetails is not an instance of Object

channel.on(trigger:string, callback:function)
---------------------------------------------
Attaches callback to trigger event.

* public
* type: function

channel.once(trigger:string, callback:function)
-----------------------------------------------
Attaches callback to trigger event only for one time.

* public
* type: function

channel.off(trigger:string)
---------------------------
Detaches callback from trigger event (destroys trigger).

* public
* type: function

channel._triggers
-----------------
Contains triggers of this channel.

* private
* type: object

