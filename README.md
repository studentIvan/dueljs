DuelJS v1.2.0 [![Documentation Status](https://readthedocs.org/projects/dueljs/badge/?version=latest)](https://readthedocs.org/projects/dueljs/?badge=latest)
======
JavaScript HTML5 Master/Slave Browser Tabs Helper.

See a brief look on [the homepage](http://dueljs.studentivan.ru)
Documentation available on http://dueljs.readthedocs.org/en/latest/

######New in 1.2.0:
* New method: channel.off - stop watching event
* New method: channel.once - executing callback only one time and stop watching event
* window.isMaster() now returns true even if no one channel has initialized [#3](https://github.com/studentIvan/dueljs/issues/3)
* Uninteresting: dev test coverage (Mocha + PhantomJS)

######New in 1.1.0:
* "storage" event improves performance in modern browsers.
To turn it off and use old method - do:

```javascript
duel.useStorageEvent = false; // auto false in IE
```

* Now only slaves can execute triggers
* Some unimportant bug fixes

######List of attested browsers:

1. Opera 27.0.1689.33 (with storage event)
2. Chrome 39.0.2171.95 (with storage event)
3. Firefox 34.0 (with storage event)
4. Internet Explorer 11 (without storage event)
5. Safari 534.57.2 (with storage event)
6. Android 4.3 LT29i default browser (with storage event)

Internet Explorer does incorrect. So it using force `useStorageEvent = false` by default.

######How it works with Internet Explorer without storage event?
Don't worry. It using setInterval javascript checking.