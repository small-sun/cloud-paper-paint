(function () {
  'use strict';
  window.PaperReader = class PaperReader extends PaperRender {
    constructor(obj) {
      super();
      this.width  = obj.width;
      this.height = obj.height;
      this.callback = obj.callback;
      let node = document.createElement('canvas');
      node.width = this.width;
      node.height = this.height;
      document.querySelector(obj.el).appendChild(node);
      this.canvas = node;
      const canvas = node;
      this.context = canvas.getContext('2d');
      let _self = this;
      // setInterval(function () {
      //   while (message.length) {
      //     last = message.shift();
      //     _self.factor = Math.min(_self.width/last.width, _self.height/last.height);
      //     switch(last.pen.type) {
      //       case 'pen':
      //         // console.log(last.type);
      //         context.lineWidth = last.pen.size*_self.factor;
      //         context.strokeStyle = last.pen.color;
      //           _self.drawLine (context, last, current);
      //         break;
      //       case 'eraser':
      //         context.clearRect(last.x*_self.factor, last.y*_self.factor, last.pen.size*3*_self.factor, last.pen.size*3*_self.factor);
      //         while(message.length) {
      //           current = message.shift();
      //           // console.log(current.type);
      //           context.clearRect(current.x*_self.factor, current.y*_self.factor, last.pen.size*3*_self.factor, last.pen.size*3*_self.factor);
      //         }
      //         break;
      //       case 'rect':
      //         // console.log(last.type.substring(5));
      //         while(message.length) {
      //           current = message.shift();
      //           // console.log(current.type.substring(5));
      //         }
      //     }
      //   }
      // }, 500);
    }

    dispatch (di) {
      let current, last; //记录上一次与本次事件的坐标
      console.log(di.type, di.pen.type);
      this.type = di.pen.type;
      this.size = di.pen.size;
      this.color = di.pen.color;
      switch(di.type) {
        case ('mousedown' || 'touchstart'):
          this.last = di;
          super.start();
          break;
        case ('mousemove' || 'touchmove'):
          this.current = di;
          super.move();
          // console.log(this.last.x, this.last.y);
          this.last = this.current;
          break;
      }
    }
  };
})();
