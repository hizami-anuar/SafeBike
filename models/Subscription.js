const mongoose = require("mongoose");

const sphericalGeometry = require("spherical-geometry-js");
const computeDistanceBetween = sphericalGeometry.computeDistanceBetween;

const dateToSeconds = (dt) => dt.getSeconds() + (60 * dt.getMinutes()) + (3600 * dt.getHours());
const stringToSeconds = (s) => { // converts hh:mm time string to seconds
  return Number.parseInt(s.split(':')[0])*3600 + Number.parseInt(s.split(':')[1])*60;
}

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const scheduleSchema = new mongoose.Schema({
    days: [Boolean],
    startTime: String, // hh:mm formatted
    endTime: String,
})

const subscriptionSchema = new mongoose.Schema({
  name: String,
  center: {
    type: pointSchema,
    required: true
  },
  radius: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  schedule: scheduleSchema,
  alertPrior: Number, // in *minutes*
})

subscriptionSchema.methods = { 
  // determines whether this region contains the given blockage
  containsBlockage: function(blockage) {
    function inCircle(circle, point) {
      let point1 = {
        lat: circle.center.coordinates[0],
        lon: circle.center.coordinates[1],
      };
      let point2 = { lat: point[0], lon: point[1] };
      let distance = computeDistanceBetween(point1, point2);
      return distance <= circle.radius;
    }
    return inCircle(this, blockage.location.coordinates);
  },
  /**
   * determines whether the specified time is in the schedule
   * (to the nearest second)
   * 
   * @param {Date} time 
   * @returns bool
   */
  containsTime: function(time) {
    // get bounds of schedule
    const startTimeSeconds = stringToSeconds(this.schedule.startTime);
    const endTimeSeconds = stringToSeconds(this.schedule.endTime);
    if (!this.schedule.days[time.getDay()]) return false; 
    const timeSeconds = dateToSeconds(time);
    return timeSeconds >= startTimeSeconds && timeSeconds <= endTimeSeconds;
  },
  /**
   * determines when user should be notified of this blockage
   * or null if blockage isn't in the region
   * 
   * @param {Blockage} blockage 
   * @returns time in unix ms
   */
  nextNotificationTimeFor: function(blockage) {
    // console.log(this.name);
    if (!this.containsBlockage(blockage)) { return null; }
    const nowTime = new Date().getTime();
    // get bounds of schedule
    // when the blockage effectively starts (handles past times)
    const bStartTime = Math.max(blockage.time, nowTime);
    const bStartDt = new Date(bStartTime);
    let dTime;
    if (this.containsTime(bStartDt)) { // alert for start of blockage
      dTime = 0;
    } else { // alert for start of next scheduled period
      let dDays = 0;
      for (; dDays < 7; dDays++) {
        const bDayOfWeek = bStartDt.getDay();
        const dayOfWeek = (bDayOfWeek + dDays) % 7;
        if (this.schedule.days[dayOfWeek]) {
          break;
        } else if (dDays === 6) {
          return null; // subscription is empty
        }
      }
      const startTimeSeconds = stringToSeconds(this.schedule.startTime);
      const bStartSeconds = dateToSeconds(bStartDt);
      const dSeconds = startTimeSeconds - bStartSeconds;
      if (dDays === 0 && dSeconds < 0) {
        dDays = 7;
      }
      dTime = 1000 * (86400 * dDays + dSeconds);
    }
    const alertTime = bStartTime + dTime - 60000 * this.alertPrior;
    // console.log(bStartTime, dTime, this.alertPrior, alertTime);
    return Math.max(alertTime, nowTime); // prevent past alerts
  },
  isEmpty: function() {
    return this.schedule.days.every(x => !x);
  },
};

module.exports = mongoose.model('Subscription', subscriptionSchema);