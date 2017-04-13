(function () {
  'use strict';
  window.PaperWritter = class PaperWritter extends PaperRender {
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
      this.type = 'pen'; //笔型
      this.size = parseInt(size.value); //笔的粗细
      this.color = color.value;
      this.init();
    }

    //writter 类的 start, move, end 是根据事件处理信息，然后调用基类的方法

    init () {
      let current, last; //记录上一次与本次事件的坐标
      let corner; //记录矩形起点
      let duplicate, layer; //第二个图层

      this.move = (e, last) => {
        e.preventDefault();
        this.current = this.getInfo(e);
        this.callback(this.current);
        super.move();
      };

      this.end = (e, last) => {
        e.preventDefault();
        this.current = this.getInfo(e, last);
        this.callback(this.current);
        super.end();
      };

      this.bindCanvas();
    }

    bindCanvas () {
      this.context = this.canvas.getContext('2d');

      this.canvas.addEventListener('touchstart', e => {
        let that = this;
        e.preventDefault();
        this.last = this.getInfo(e);
        super.start();
        this.callback(this.last);
        canvas.addEventListener('touchmove', this.move, {passive: false});
        document.addEventListener('touchend', function _self(e) {
          console.log(that.last);
          that.end(e, that.last);
          canvas.removeEventListener('touchmove', that.move, {passive: false});
          document.removeEventListener('touchend', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});

      this.canvas.addEventListener('mousedown', e => {
        let that = this;
        e.preventDefault();
        this.last = this.getInfo(e);
        super.start();
        this.callback(this.last);
        this.canvas.addEventListener('mousemove', this.move, {passive: false});
        document.addEventListener('mouseup', function _self(e) {
          that.end(e, that.last);
          that.canvas.removeEventListener('mousemove', that.move, {passive: false});
          document.removeEventListener('mouseup', _self, {passive: false});
        }, {passive: false});
      }, {passive: false});
    }

    getInfo (e, last) {
      let x, y;
      if (e.type === 'touchend') { //touchend 和 mouseup 这两个事件比较奇葩，需要特殊处理
        x = this.last.x;
        y = this.last.y;
      } else if (e.type === 'mouseup') { //mouseup 有 x, y 坐标，不过先偷懒一下
        x = this.last.x;
        y = this.last.y;
      } else if (e.type.substring(0, 5) === 'touch') {
        x = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
      } else {
        x = e.clientX - e.currentTarget.getBoundingClientRect().left;
        y = e.clientY - e.currentTarget.getBoundingClientRect().top;
      }
      return new DrawInfo({
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
