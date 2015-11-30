export default class DomHandler {
  constructor(){
    this.innerpopout = document.querySelectorAll('.pop-stripe')[0];
    this.score = document.querySelectorAll('.score')[0];
  }

  pop(message, color){
    let self = this;
    this.popoutstart(message, color);
    setTimeout(() => {
      self.popoutend();
    }, 1000);
  }

  popoutstart(message, color){
    this.innerpopout.style.background = color;
    this.innerpopout.textContent = message;
    this.innerpopout.classList.add('show');

  }

  popoutend(){
    this.innerpopout.classList.remove('show');
  }

  setscore(lvl){
    this.score.textContent = `YOU'VE PICKED ${lvl-1} LOCKS IN A ROW.`;
  }
}
