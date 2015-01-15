/**
 * PhantomJS Test Script
 */

var webPage = require('webpage');

var page1 = webPage.create();
var page2 = webPage.create();
var page3 = webPage.create();

function shouldBeEqual(arg1, arg2) {
    if (arg1 === arg2) {
        console.log(arg1, '===', arg2, 'ok');
    } else {
        console.log(arg1, '!==', arg2, 'test failed');
        phantom.exit();
    }
}

page1.open('test/phantom.tab.html', function () {

    var title1 = page1.evaluate(function () {
        return document.title;
    });

    shouldBeEqual(/master/i.test(title1), true);

    page2.open('test/phantom.tab.html', function () {

        page3.open('test/phantom.tab.html', function () {

            var wndID1 = page1.evaluate(function () {
                return duel.getWindowID();
            });

            page2.onCallback = function (data) {
                shouldBeEqual(data.wndID, wndID1.toString() + ' "ya"');
            };

            page3.onCallback = function (data) {
                shouldBeEqual(data.wndID, wndID1.toString() + ' "ya"');
            };

            var broadcast = page1.evaluate(function () {
                channel.broadcast('demo_trigger', 'ya', duel.getWindowID());
                return true;
            });

            shouldBeEqual(broadcast, true);

            /**
             * Why storage event doesn't work in phantom?
             * https://github.com/ariya/phantomjs/issues/12879
             */

            setTimeout(phantom.exit, 2000);
        });
    });
});