define(function (require) {
    var chai = require('../node_modules/chai/chai');
    var duel = require('../public/lib/duel');

    mocha.ui('bdd');
    mocha.reporter('html');
    mocha.globals(['duel']);

    var expect = chai.expect;

    describe('DuelJS test case requirejs', function() {
        describe('#initialization testing', function() {

            it('duel should be initialized', function() {
                expect(duel).to.be.an.instanceof(Object);
            });

            it('duel integrity should be complete', function() {
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
    });

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
});
