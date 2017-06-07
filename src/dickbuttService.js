const Promise = require('bluebird');
const moment = require('moment');
moment.locale('fi');

class DickbuttService {
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
        const secondsToNext = this.getRandomRangedInteger(30 * 60, 600 * 60) / 60;
        let next = moment().add(moment.duration(secondsToNext, 'milliseconds'));
        if(next.isoWeekday() != 5) {
            const nextFriday = this.getNextFriday();
            next.set({
                'year': nextFriday.year(),
                'month': nextFriday.month(),
                'day': nextFriday.day()});
        }
        return next;
    }

    post() {
        console.log("kokpers");
    }

    start() {
        return new Promise((resolve, reject) => {
            try {
                this.post();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    delayUntil(time) {
        return this.start().delay(60000).then((resolve) =>
                moment().isAfter(time) ? resolve() : this.delayUntil(time));
    }

    run() {
        const next = this.getNextPostTime();
        console.log(next.format());
        this.delayUntil(next).then(() => this.run());
    }
};

module.exports = DickbuttService;
