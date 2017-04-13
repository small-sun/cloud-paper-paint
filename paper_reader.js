(function () {
  'use strict';
  window.PaperReader = class PaperReader {
    constructor(obj) {
      this.width  = obj.width;
      this.height = obj.height;
      obj.el.innerHTML =  `<canvas width="${this.width}" height="${this.height}"></canvas>`;
      let canvas = obj.el.querySelector('canvas');
      let context = canvas.getContext('2d');
      let _self = this;
      let current, last; //记录上一次与本次事件的坐标
      setInterval(function () {
        if (message.length) {
          last = message.shift();
          _self.factor = Math.min(_self.width/last.width, _self.height/last.height);
          switch(last.pen.type) {
            case 1:
              // console.log(last.type);
              context.lineWidth = last.pen.size*_self.factor;
              context.strokeStyle = last.pen.color;
              while(message.length) {
                current = message.shift();
                _self.drawLine (context, last, current);
                last = current;
                // console.log(current.type);
              }
              break;
            case 2:
              context.clearRect(last.x*_self.factor, last.y*_self.factor, last.pen.size*3*_self.factor, last.pen.size*3*_self.factor);
              while(message.length) {
                current = message.shift();
                // console.log(current.type);
                context.clearRect(current.x*_self.factor, current.y*_self.factor, last.pen.size*3*_self.factor, last.pen.size*3*_self.factor);
              }
              break;
            case 4:
              // console.log(last.type.substring(5));
              while(message.length) {
                current = message.shift();
                // console.log(current.type.substring(5));
              }
          }
        }
      }, 500);
    }

    fork (e, move, end) {
      let duplicate, layer;
      duplicate = document.createElement('canvas');
      duplicate.width = this.width;
      duplicate.height = this.height;
      duplicate.style.position = 'absolute';
      duplicate.style.left = e.currentTarget.getBoundingClientRect().left+'px';
      duplicate.style.top = e.currentTarget.getBoundingClientRect().top+'px';
      duplicate.style['z-index'] = 1;
      layer = duplicate.getContext('2d');
      document.body.appendChild(duplicate);
      duplicate.addEventListener('touchmove', move, {passive: false});
      document.addEventListener('touchend', function _self() {
        duplicate.removeEventListener('touchmove', move, {passive: false});
        duplicate.removeEventListener('touchend', _self, {passive: false});
        end(e);
      }, {passive: false});
      duplicate.addEventListener('mousemove', move, {passive: false});
      document.addEventListener('mouseup', function _self() {
        duplicate.removeEventListener('mousemove', move, {passive: false});
        duplicate.removeEventListener('mouseup', _self, {passive: false});
        end(e);
      }, {passive: false});
      return [duplicate, layer];
    }

    bindCanvas (canvas, start, move, end) {
      canvas.addEventListener('touchstart', e => {
        start(e);
        canvas.addEventListener('touchmove', move, {passive: false});
        document.addEventListener('touchend', function _self() {
          canvas.removeEventListener('touchmove', move, {passive: false});
          canvas.removeEventListener('touchend', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
      canvas.addEventListener('mousedown', e => {
        start(e);
        canvas.addEventListener('mousemove', move, {passive: false});
        document.addEventListener('mouseup', function _self() {
          canvas.removeEventListener('mousemove', move, {passive: false});
          canvas.removeEventListener('mouseup', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
    }

    drawLine (context, first, last) {
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(last.x, last.y);
      context.stroke();
      context.closePath();
    }

    drawEllipse(context, x, y, a, b) {
      context.save();
      var r = (a > b) ? a : b;
      var ratioX = a / r;
      var ratioY = b / r;
      context.scale(ratioX, ratioY);
      context.beginPath();
      context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
      context.closePath();
      context.restore();
      context.stroke();
    }
  };
})();
