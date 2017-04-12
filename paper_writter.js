(function () {
  'use strict';
  window.PaperWritter = class PaperWritter {
    constructor(obj) {
      this.width  = obj.width;
      this.height = obj.height;
      let node = document.createElement('canvas');
      node.width = this.width;
      node.height = this.height;
      obj.el.appendChild(node);
      const canvas = obj.el.querySelector('canvas');
      const type = obj.type;
      const size = obj.size;
      const color = obj.color;
      this.type = parseInt(type.value); //笔型
      this.size = parseInt(size.value); //笔的粗细
      this.color = color.value;
      this.init(canvas, type, size, color);
    }

    init (canvas, type, size, color) {
      const context = canvas.getContext('2d');
      const _self = this;
      let current, last; //记录上一次与本次事件的坐标
      let start = function (e) {
        e.preventDefault();
        last = _self.getInfo(e);
        switch (_self.type) {
          case 1:
            context.lineWidth = _self.size;
            context.strokeStyle = _self.color;
            break;
          case 2:
            // 这里需要 CSS 光标样式
            break;
        }
        message.push(last);
      };
      let move = function (e) {
        e.preventDefault();
        current = _self.getInfo(e);
        message.push(current);
        switch (_self.type) {
          case 1:
            context.beginPath();
            context.moveTo(last.x, last.y);
            context.lineTo(current.x, current.y);
            context.stroke();
            context.closePath();
            break;
          case 2:
            context.clearRect(current.x, current.y, _self.type*10, _self.type*10);
            break;
        }
        last = current;
      };
      let end = function (e) {
        e.preventDefault();
      };

      let writeText = function (e) {
        current = _self.getInfo(e);
        let text = document.createElement('div');
        text.className = 'text';
        text.style.left = e.clientX+'px';
        text.style.top = e.clientY+'px';
        console.log(canvas);
        document.body.appendChild(text);
        message.push(current);
      };

      type.addEventListener('change', e => {
        this.type = parseInt(e.target.value);
        if (this.type === 3) {
          canvas.addEventListener('click', writeText, {passive: false});
        } else {
          canvas.removeEventListener('click', writeText, {passive: false});
        }
      });
      size.addEventListener('change', e => {
        this.size = e.target.value;
      });
      color.addEventListener('change', e => {
        this.color = e.target.value;
      });

      this.bindEvent(canvas, start, move, end);
    }

    bindEvent (canvas, start, move, end) {
      canvas.addEventListener('touchstart', function (e) {
        start(e);
        canvas.addEventListener('touchmove',move , {passive: false});
        document.addEventListener('touchend', function _self() {
          canvas.removeEventListener('touchmove', move, {passive: false});
          canvas.removeEventListener('touchend', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
      canvas.addEventListener('mousedown', function (e) {
        start(e);
        canvas.addEventListener('mousemove', move, {passive: false});
        document.addEventListener('mouseup', function _self() {
          canvas.removeEventListener('mousemove', move, {passive: false});
          canvas.removeEventListener('mouseup', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
    }

    getInfo (e) {
      let x, y;
      if (e.type.substring(0, 5) === 'touch') {
        x = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
      } else {
        x = e.clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.clientY - e.currentTarget.getBoundingClientRect().top;
      }
      return new Position({
        width: this.width,
        height: this.height,
        timeStamp: e.timeStamp,
        type: e.type,
        x: x,
        y: y,
        pen: {
          type: this.type,
          size: this.size,
          color: this.color,
          opacity: 1
        }
      });
    }
  };
})();
