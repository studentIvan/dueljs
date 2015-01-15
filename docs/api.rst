API
===

duel
----
Main global object.

* global
* type: object

duel.useStorageEvent
--------------------
Optional configuration. Storage event improves performance in modern browsers.

* public
* type: boolean
* default: true (IE - false)

duel.isLocalStorageAvailable()
------------------------------
Common function for localStorage detection.

* public
* type: function
* returns: boolean

duel.clone(obj:object)
----------------------
Common function for copy objects.

* public
* type: function
* returns: object
* throws error on unsupported type

duel.clone(obj:object)
----------------------
Common function for copy objects.

* public
* type: function
* returns: object

duel.DuelAbstractChannel
------------------------
Abstract class for possible duel channels. Will support another channels besides localStorage in future.

* abstract
* type: object
