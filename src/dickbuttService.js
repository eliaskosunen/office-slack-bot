const Promise = require('bluebird');
const moment = require('moment');
moment.locale('fi');

class DickbuttService {
    constructor(enabled, postCallback) {
        if (enabled) {
            this.post = postCallback;
            this.run();
        }
    }

    getNextFriday() {
        const friday = 5;
        if(moment().isoWeekday() <= friday)
            return moment().isoWeekday(friday);
        return moment().add(1, 'weeks').isoWeekday(friday);
    }

    getRandomRangedInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getNextPostTime() {
        const secondsToNext = this.getRandomRangedInteger(30 * 60, 600 * 60);
        let next = moment().add(moment.duration(secondsToNext, 'seconds'));
        if(next.isoWeekday() != 5) {
            const nextFriday = this.getNextFriday();
            next.set({
                'year': nextFriday.year(),
                'month': nextFriday.month(),
                'day': nextFriday.day()});
        }
        return next;
    }

    delayUntil(time) {
        return new Promise((resolve, reject) => {
            while (true) {
                new Promise(() => {}).delay(1000);
                if (moment().isAfter(time)) {
                    break;
                }
            }
            resolve();
        });
    }

    run() {
        new Promise((resolve, reject) => {
            while (true) {
                const next = this.getNextPostTime();
                console.log("Next surprise coming at: " + next.format());
                this.delayUntil(next);
                this.post();
            }
            resolve();
        }).then(() => console.log("Friday fun over"));
    }
};

module.exports = DickbuttService;
