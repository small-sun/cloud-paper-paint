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
      const canvas = node;
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
      let current, last; //记录上一次与本次事件的坐标
      let corner; //记录矩形起点
      let duplicate, layer; //第二个图层

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

      let start = e => {
        e.preventDefault();
        last = this.getInfo(e);
        switch (this.type) {
          case 1: //画笔
            context.lineWidth = this.size;
            context.strokeStyle = this.color;
            break;
          case 2: //橡皮
            // 这里需要设置 CSS 光标样式
            break;
          case 4: //矩形
          case 5: //椭圆
            corner = last;
            [duplicate, layer] = this.fork(e, move, end);
            break;
        }
        message.push(last);
      }

      let move = e => {
        e.preventDefault();
        current = this.getInfo(e);
        message.push(current);
        switch (this.type) {
          case 1:
            this.drawLine(context, last, current);
            break;
          case 2:
            context.clearRect(current.x, current.y, this.type*10, this.type*10);
            break;
          case 4:
            layer.clearRect(0, 0, duplicate.width, duplicate.height);
            layer.strokeRect(corner.x, corner.y, current.x-corner.x, current.y-corner.y);
            break;
          case 5:
            layer.clearRect(0, 0, duplicate.width, duplicate.height);
            this.drawEllipse(layer, corner.x, corner.y, current.x-corner.x, current.y-corner.y);
            break;
        }
        last = current;
      }

      let end = e => {
        console.log(e.type);
        current = this.getInfo(e, last);
        e.preventDefault();
        switch(this.type) {
          case 4:
            context.strokeRect(corner.x, corner.y, current.x-corner.x, current.y-corner.y);
            break;
          case 5:
            this.drawEllipse(context, corner.x, corner.y, current.x-corner.x, current.y-corner.y);
            break;
        }
        message.push(current);
      }

      let writeText = e => {
        current = this.getInfo(e);
        let text = document.createElement('div');
        text.className = 'text';
        text.style.left = e.clientX+'px';
        text.style.top = e.clientY+'px';
        document.body.appendChild(text);
        // message.push(current);
      }

      this.bindCanvas(canvas, start, move, end);
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
      document.addEventListener('touchend', function _self(e) {
        end(e);
        duplicate.removeEventListener('touchmove', move, {passive: false});
        document.removeEventListener('touchend', _self, {passive: false});
        document.body.removeChild(duplicate);
      }, {passive: false});

      duplicate.addEventListener('mousemove', move, {passive: false});
      document.addEventListener('mouseup', function _self(e) {
        console.log('hello');
        end(e);
        duplicate.removeEventListener('mousemove', move, {passive: false});
        document.removeEventListener('mouseup', _self, {passive: false});
        document.body.removeChild(duplicate);
      }, {passive: false});

      return [duplicate, layer];
    }

    bindCanvas (canvas, start, move, end) {
      canvas.addEventListener('touchstart', e => {
        start(e);
        canvas.addEventListener('touchmove', move, {passive: false});
        document.addEventListener('touchend', function _self(e) {
          end(e);
          canvas.removeEventListener('touchmove', move, {passive: false});
          document.removeEventListener('touchend', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
      canvas.addEventListener('mousedown', e => {
        start(e);
        canvas.addEventListener('mousemove', move, {passive: false});
        document.addEventListener('mouseup', function _self(e) {
          console.log('canvas');
          end(e);
          canvas.removeEventListener('mousemove', move, {passive: false});
          document.removeEventListener('mouseup', _self, {passive: false});
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

    getInfo (e, last) {
      let x, y;
      if (e.type === 'touchend') { //touchend 和 mouseup 这两个事件比较奇葩，需要特殊处理
        x = last.x;
        y = last.y;
      } else if (e.type === 'mouseup') { //mouseup 有 x, y 坐标，不过先偷懒一下
        x = last.x;
        y = last.y;
      } else if (e.type.substring(0, 5) === 'touch') {
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
