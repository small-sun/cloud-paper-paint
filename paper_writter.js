(function () {
  'use strict';
  window.PaperWritter = class PaperWritter {
    constructor(obj) {
      this.width  = obj.width;
      this.height = obj.height;
      this.lineWidth = obj.lineWidth || 1.0;
      this.color = obj.color || 'black';
      obj.el.innerHTML =  `<nav>
                  <select id="type">
                    <option value="1">铅笔</option>
                    <option value="2">橡皮</option>
                  </select>
                  <select id="size">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </nav>
                <canvas width="${this.width}" height="${this.height}"></canvas>`;
      let canvas = obj.el.querySelector('canvas');
      let type = document.getElementById('type'); //笔型
      let size = document.getElementById('size'); //笔的粗细
      let context = canvas.getContext('2d');
      let _self = this;
      let current, last; //记录上一次与本次事件的坐标
      this.type = type.value;
      this.size = size.value;
      type.addEventListener('change', function(e) {
        this.type = e.target.value;
      });
      size.addEventListener('change', function() {
        this.size = e.target.value;
      });
      canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        context.lineWidth = this.lineWidth;
        context.color = this.color;
        last = _self.collectInfo(e);
        message.push(last);
      });
      canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        current = _self.collectInfo(e);
        message.push(current);
        context.beginPath();
        context.moveTo(last.x, last.y);
        context.lineTo(current.x, current.y);
        context.stroke();
        context.closePath();
        last = current;
      });
      canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
      });
    }

    collectInfo (e) {
      return {
        width: this.width,
        height: this.height,
        timeStamp: e.timeStamp,
        type: e.type,
        x: e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left,
        y: e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top,
        pen: {
          type: this.type,
          size: this.size,
          color: 'black',
          opacity: 1
        }
      };
    }
  };
})();
