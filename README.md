DuelJS v1.2.7
======
[![Documentation Status](https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat-square)](http://dueljs.readthedocs.org/) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/studentIvan/dueljs/master/LICENSE) [![Bower](https://img.shields.io/bower/v/duel.svg?style=flat-square)](http://bower.io/search/?q=duel) [![](https://img.shields.io/github/issues-raw/studentIvan/dueljs.svg?style=flat-square)](https://github.com/studentIvan/dueljs/issues/) [![GitHub stars](https://img.shields.io/github/stars/studentIvan/dueljs.svg?style=flat-square)](https://github.com/studentIvan/dueljs/stargazers) [![Travis branch](https://img.shields.io/travis/studentIvan/dueljs/master.svg?style=flat-square)](https://travis-ci.org/studentIvan/dueljs)

JavaScript HTML5 Master/Slave Browser Tabs Helper.

See a brief look on [the homepage](http://dueljs.studentivan.ru)

Documentation available on http://dueljs.readthedocs.org/

######New in 1.2.7:
* Fixed [#13](https://github.com/studentIvan/dueljs/issues/13): webpack import

######New in 1.2.6:
* Fixed [#11](https://github.com/studentIvan/dueljs/issues/11): localstorage issue for private browsing (thanks to Stéphane Bachelier <stephane.bachelier@gmail.com>)
* Library added to npm as dueljs (thanks to Denis Lukov <youCanCallMeDen@gmail.com>)

######New in 1.2.5:
* Different variables for each channel (setItem, getItem, removeItem)

######New in 1.2.4:
* New storage methods setItem, getItem, removeItem with JSONify inside
* Direct localStorage changed to window.localStorage
* Fixed emit bug (arguments)
* New configuration duel.noWarnings

```javascript
/** Turn off errors for debug */
duel.noWarnings = false;
/** New storage methods example */
var ch = duel.channel('demo');
ch.setItem('x', 10);
ch.setItem('y', {'a': true});
ch.getItem('x'); // 10
ch.getItem('y'); // Object {'a': true}
```

######New in 1.2.3:
* UMD compatible (thanks to RasCarlito <cogren@eleven-labs.com>)
* Microsoft Edge attested (thanks to toby11)

######New in 1.2.2:
* Fixed some additional bugs (extra-release)

######New in 1.2.1:
* Fixed [#5](https://github.com/studentIvan/dueljs/issues/5): localStorage - stack overflow problem (thanks to Alex Core <brojecter@yandex.ru>)

######New in 1.2.0:
* New method: channel.off - stop watching event
* New method: channel.once - executing callback only one time and stop watching event
* New method: channel.emit - the alias of channel.broadcast
* Function window.isMaster() now returns true even if no one channel has initialized [#3](https://github.com/studentIvan/dueljs/issues/3)
* Dev test coverage (Mocha + PhantomJS)

######New in 1.1.0:
* "storage" event improves performance in modern browsers.
To turn it off and use old method - do:

```javascript
duel.useStorageEvent = false; // auto false in IE
```

* Now only slaves can execute triggers
* Some unimportant bug fixes

######List of attested browsers:

1. Opera 29.0.1795.35 (with storage event)
2. Chrome 41.0.2272.118 (with storage event)
3. Firefox 34.0 (with storage event)
4. Internet Explorer 11 (without storage event)
5. Safari 534.57.2 (with storage event)
6. Android 4.3 LT29i default browser (with storage event)
7. Microsoft Edge 25.10586.0.0 (with storage event)

Internet Explorer does incorrect. So it using force `useStorageEvent = false` by default.

######How it works with Internet Explorer without storage event?
Don't worry. It using setInterval javascript checking.

######Testing suite
1. NodeJS version 6.7.0
2. PhantomJS version 2.1.1
3. Chai version 3.5.0
4. Mocha version 3.1.0
5. Mocha-PhantomJS custom fork of 4.1.0

In Mac OS Sierra you want to use phantomjs from brew (brew install phantomjs) and check to link it:

```
$ which phantomjs
/usr/local/bin/phantomjs
```

And also you can create this link by yourself:

```
ln -s /usr/local/Cellar/phantomjs/2.1.1/bin/phantomjs /usr/local/bin/phantomjs
```

The reason I temporary changed original repo of mocha-phantomjs to git+https://github.com/studentIvan/mocha-phantomjs.git#master is cause mocha-phantomjs doesn't support the second phantomjs right now.