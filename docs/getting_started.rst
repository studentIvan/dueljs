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
* Main file: `duel.min.js <https://github.com/studentIvan/dueljs/blob/master/public/lib/duel.min.js>`_


Put it into your webpage:
``<script type="text/javascript" src="path/to/duel.min.js"></script>``

So we've got all the set up out of the way. Let's write some simple code.
::
    <script type="text/javascript">
    var channel = duel.channel('my_first_channel');
    // now you have opened some channel, this tab is connected to it

    setInterval(function () {
        if (channel.currentWindowIsMaster()) {
            // here you checking is this tab active (in focus) or not
            // you can use alternative syntax: if (window.isMaster()) { ...

            document.title = 'Master ' + duel.getWindowID();
            // duel.getWindowID returns a unique browser tab id

        } else {
            document.title = 'Slave ' + duel.getWindowID();
        }
    }, 100);
    </script>

Talk to another tab
-------------------
When your tab had some channel (e.g. **my_first_channel** from previous section) you can talk with another tabs in it.

Use simple commands:

* **channel.broadcast('event_name', a,r,g,u,m,e,n,t,s...);** (or channel.emit alias) - send event command to all another tabs in channel
* **channel.on('event_name', function (a,r,g,u,m,e,n,t,s...) { do here what you want });** - define watcher for event_name
* **channel.off('event_name');** - remove event_name watcher

If you still need more docs go to API section and study it