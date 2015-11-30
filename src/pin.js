import DomHandler from './domhandler.js'

export default class Pin {
  constructor(){
    let self = this;
    this.range = {
      min: 0,
      max: 100
    };
    this.level = 0;
    this.currentposition = 0;
    this.threshold = 0;
    this.point = 50;
    this.domhandler = new DomHandler();
    this.limit = 0;
    this.twisting = false;
    this.vibrating = false;

    let _duration = 100;
    Object.defineProperty(this, 'duration', {
      get: () => {
          return _duration;
      },
      set: (value) => {
          _duration = value;

          if(_duration % 2 === 0){
            self.vibrating = !self.vibrating;
          }
          if(!_duration){
            this.domhandler.pop("Pin broke!", "#c0392b");
            this.resetLockpick(1);
          }
      }
    });

    let _completed = 0;
    Object.defineProperty(this, 'completed', {
      get: () => {
          return _completed;
      },
      set: (value) => {
          _completed = value;

          if(_completed === 100){
            this.domhandler.pop("Lock opened!", "#27af60");
            self.resetLockpick(self.level + 1);
          }
      }
    });

    this.duration = 100;
    this.completed = 0;

    this.resetLockpick(1);
  }

  setPinPosition(value){
    const valueadded = this.point + value;
    if(valueadded >= 0 && valueadded <= 100){
      this.point = valueadded;
    }
  }

  calculatetwistlimit(){
    let pointrange = { min: this.currentposition - this.threshold, max: this.currentposition + this.threshold };
    if(this.point < pointrange.min){
      this.limit = this.percentageprogress(this.point, this.range.min, pointrange.min);
    } else if(this.point > pointrange.max){
      this.limit = this.percentageprogress(100 - this.point, 100 - pointrange.max, 0) * -1;
    } else {
      this.limit = 100;
    }
  }

  percentageprogress(currentvalue, min, max){
    return currentvalue / (max - min) * 100;
  }

  twistlock(){
    if(this.completed < this.limit){
      this.completed += 2;
      return;
    }
    if(this.completed < 100 && this.duration > 0){
      this.duration -= 1;
    }
  }

  untwistlock(){
    if(this.completed > 0){
      this.completed -= 2;
      this.vibrating = true;
    }
  }

  resetLockpick(lvl){
    this.level = lvl;
    this.threshold = 20 / this.level;
    this.currentposition = Math.floor(Math.random() * (this.range.max - this.range.min + 1)) + this.range.min;
    this.duration = 100;
    this.twisting = false;
    this.completed = 0;
    this.domhandler.setscore(this.level);
  }
}
