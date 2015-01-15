var expect = chai.expect;

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
            expect(duel.DuelLocalStorageChannel.prototype.setCurrentWindowAsMaster).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.currentWindowIsMaster).not.to.be.an('undefined');
            expect(duel.DuelLocalStorageChannel.prototype.broadcast).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.getName).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.executeTrigger).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.on).not.to.be.an('undefined');
            expect(duel.DuelFakeChannel.prototype.once).not.to.be.an('undefined');
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

        it('window.isMaster() should be equal false without channels', function () {
            expect(window.isMaster()).to.equal(false);

            describe('DuelJS test case 2', function () {
                describe('#channel testing', function () {
                    var channel = duel.channel('_test');

                    it('duel.channel should returns new channel instance', function () {
                        expect(channel).to.be.an.instanceof(Object);
                    });

                    it('window.isMaster() should be equal true with initialized channel', function () {
                        expect(window.isMaster()).to.equal(true);
                    });

                    it('cunning plan', function () {
                        channel = duel.channel('_test');
                        channel = duel.channel('_test');
                        var channel2 = duel.channel('_test2');
                        var channel3 = duel.channel('_test');
                        expect(duel.activeChannels.length).to.equal(2);
                        expect(channel3).to.equal(channel);
                    });
                });
            });
        });
    });
});