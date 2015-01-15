.. highlight:: html
Getting Started
===============

Getting started with DuelJS.

Requirements
------------

With DuelJS you no need to any requirements - only vanilla js and modern web browser.
Don't try to use it with node.js without browser emulators.

Installing DuelJS
-----------------

You can install it using bower or simple copy duel.js main file into your site or even clone git repository.

* Bower package: ``bower install duel --save``
* Git repo: ``git clone https://github.com/studentIvan/dueljs.git``
* Main file: `https://github.com/studentIvan/dueljs/blob/master/public/lib/duel.min.js <https://github.com/studentIvan/dueljs/blob/master/public/lib/duel.min.js>`_


Put it into your webpage:
.. code-block:: html
    <script type="text/javascript" src="path/to/duel.min.js"></script>

So we've got all the set up out of the way. Let's write some simple code.
.. code-block:: javascript
    <script type="text/javascript">
    var channel = duel.channel('my_first_channel'); // now you have opened some channel, this tab is connected to it
    setInterval(function () {
        if (channel.currentWindowIsMaster()) { // here you checking is this tab active (in focus) or not
            // you can use alternative syntax: if (window.isMaster()) { ...
            document.title = 'Master ' + duel.getWindowID(); // duel.getWindowID returns a unique browser tab id
        } else {
            document.title = 'Slave ' + duel.getWindowID();
        }
    </script>
