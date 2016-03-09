var expect = chai.expect;

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

describe('DuelJS test case 1', function () {
    describe('#initialization testing', function () {

        it('duel should be initialized', function () {
            expect(duel).to.be.an.instanceof(Object);
        });

        if (!/trident|MSIE/i.test(navigator.userAgent)) {
            it('duel should be with useStorageEvent == true with ' + navigator.userAgent, function () {
                expect(duel.useStorageEvent).to.equal(true);
            });
        } else {
            it('duel should be with useStorageEvent == false with ' + navigator.userAgent, function () {
                expect(duel.useStorageEvent).to.equal(false);
            });
        }

        it('duel.isLocalStorageAvailable should be a function and should returns true', function () {
            expect(duel.isLocalStorageAvailable).not.to.be.an('undefined');
            expect(duel.isLocalStorageAvailable()).to.equal(true);
        });

        it('duel integrity should be complete', function () {
            expect(duel.clone).not.to.be.an('undefined');
            expect(duel.DuelAbstractChannel).not.to.be.an('undefined');
            expect(duel.getWindowID).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.getName).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.executeTrigger).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.on).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.once).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.off).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.emit).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.setCurrentWindowAsMaster).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.currentWindowIsMaster).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.broadcast).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.getName).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.executeTrigger).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.on).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.once).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.off).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.emit).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.setCurrentWindowAsMaster).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.currentWindowIsMaster).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.broadcast).not.to.be.an('undefined');
            expect(duel.activeChannels).to.be.an('array');
            expect(duel.channel).not.to.be.an('undefined');
            expect(duel.makeCurrentWindowMaster).not.to.be.an('undefined');
            expect(window.isMaster).not.to.be.an('undefined');
            expect(duel.addEvent).not.to.be.an('undefined');
            expect(duel.storageEvent).not.to.be.an('undefined');
        });
    });

    describe('#window testing', function () {

        duel.activeChannels = [];

        it('duel.getWindowID should returns unique Window ID', function () {
            var windowID = duel.getWindowID();
            expect(windowID).to.be.a('number');
            expect(duel.getWindowID()).to.equal(windowID);
        });

        it('window.isMaster() should be equal true without channels', function () {
            expect(window.isMaster()).to.equal(true);

            describe('DuelJS test case 2', function () {
                describe('#channel testing', function () {
                    var channel = duel.channel('_test');

                    it('duel.channel should returns new channel instance', function () {
                        expect(channel).to.be.an.instanceof(Object);
                    });

                    it('window.isMaster() should be equal true with initialized channel', function () {
                        expect(window.isMaster()).to.equal(true);
                    });

                    it('should not to dublicate an channels', function () {
                        channel = duel.channel('_test');
                        channel = duel.channel('_test');
                        var channel2 = duel.channel('_test2');
                        var channel3 = duel.channel('_test');
                        expect(duel.activeChannels.length).to.equal(2);
                        expect(channel3).to.equal(channel);
                        expect(channel.currentWindowIsMaster()).to.equal(true);
                        expect(channel2.currentWindowIsMaster()).to.equal(true);
                        expect(channel3.currentWindowIsMaster()).to.equal(true);
                    });

                    it('should create the event', function (done) {
                        var _check = -5;
                        channel.on('test_event', function (a, b, c) {
                            _check += a + b + c;
                            expect(_check).to.equal(0);
                        });
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        expect(channel._triggers).not.to.eql({});
                        channel._triggers = {};
                        done();
                    });

                    it('should remove the event', function (done) {
                        var _check = -5;
                        channel.on('test_event', function (a, b, c) {
                            _check += a + b + c;
                        });
                        channel.off('test_event');
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        expect(_check).to.equal(-5);
                        expect(channel._triggers).to.eql({});
                        done();
                    });

                    it('should create the event and remove it after once', function (done) {
                        var __check = -5;
                        expect(channel._triggers).to.eql({});
                        channel.once('test_event', function (a, b, c) {
                            __check += a + b + c;
                        });
                        expect(channel._triggers).not.to.eql({});
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        expect(__check).to.equal(0);
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        expect(__check).to.equal(0);
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]}, true);
                        expect(__check).to.equal(0);
                        expect(channel._triggers).to.eql({});
                        channel.off('test_event');
                        done();
                    });

                    it('should not execute an trigger in a master window', function () {
                        var __check = -5;
                        channel.once('test_event', function (a, b, c) {
                            __check += a + b + c;
                        });
                        channel.executeTrigger({name: 'test_event', args: [0, 4, 1]});
                        expect(__check).to.equal(-5);
                        channel.off('test_event');
                    });

                    it('should not to dublicate an triggers', function () {
                        expect(channel._triggers).to.eql({});
                        channel.on('test_event', function () {
                            return true;
                        });
                        expect(channel._triggers).not.to.eql({});
                        expect(Object.size(channel._triggers)).to.eql(1);
                        channel.on('test_event', function () {
                            return true;
                        });
                        expect(Object.size(channel._triggers)).to.eql(1);
                        channel.off('test_event');
                        expect(Object.size(channel._triggers)).to.eql(0);
                    });

                    it('should create item and get him back', function () {
                        channel.setItem('x', 10);
                        expect(channel.getItem('x')).to.eql(10);
                    });
                });
            });
        });
    });
});