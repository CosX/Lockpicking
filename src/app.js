import Pin from './pin.js'

class PicklockGame {
  constructor(){
    let self = this;
    this.canvas = document.getElementById('PicklockGame');
    this.context = this.canvas.getContext('2d');
    this.lastposition = {};
    this.pin = new Pin();

    window.addEventListener('resize', () => { self.resizeCanvas() }, false);

    window.addEventListener('mousemove', () => {
      if (typeof(self.lastposition.x) != 'undefined' && !self.pin.twisting) {
        let deltaX = self.lastposition.x - event.offsetX,
            deltaY = self.lastposition.y - event.offsetY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
            self.pin.setPinPosition(-0.5);
        } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
            self.pin.setPinPosition(0.5);
        }
        self.pin.calculatetwistlimit();
      };
      self.lastposition = {
          x : event.offsetX,
          y : event.offsetY
      };
    }, false);

    window.addEventListener('mousedown', () => {
      self.pin.twisting = true;
    }, false);

    window.addEventListener('mouseup', () => {
      self.pin.twisting = false;
    }, false);

    this.resizeCanvas();
    this.frame();
  }

  resizeCanvas(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  frame(){
    let self = this;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.pin.twisting){
      this.pin.twistlock();
    } else{
      this.pin.untwistlock();
    }
    this.drawlock();
    this.drawlockhole();
    this.drawpin();
    window.requestAnimationFrame(() => {self.frame();});
  }

  drawlock(){
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = 0;
    this.context.arc(this.canvas.width / 2, this.canvas.height / 2, 100, 0, 2 * Math.PI, false);
    this.context.fillStyle = '#bdc3c7';
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }

  drawlockhole(){
    let percentage = this.pin.completed / 100;
    let degrees = percentage * 90.0;
    let radians = degrees * (Math.PI / 180);
    let x = this.canvas.width / 2;
    let y = this.canvas.height / 2;

    this.context.save();
    this.context.translate( x, y );
    this.context.rotate( radians );
    this.context.translate( -x, -y );
    this.context.fillRect( x, y, 4, 18 );
    this.context.fillRect( x, y, 4, -18 );
    this.context.fillRect( x, y, -4, 18 );
    this.context.fillRect( x, y, -4, -18 );
    this.context.restore();
  }

  drawpin(){
    let offset = this.pin.vibrating ? 2 : 0;
    let percentage = (this.pin.point + offset) / 100;
    let degrees = (percentage + 0.5) * 180.0;
    let radians = degrees * (Math.PI / 180);
    let x = this.canvas.width / 2;
    let y = this.canvas.height / 2;

    this.context.save();
    this.context.translate( x, y );
    this.context.rotate( radians );
    this.context.translate( -x, -y );
    this.context.fillStyle = '#f1c40f';
    this.context.fillRect( x-1, y, 4, 170 );
    this.context.fillRect( x+1, y, -4, 170 );
    this.context.restore();
  }
}

new PicklockGame();
