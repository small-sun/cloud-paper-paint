# cloud-paper-paint
cloud-paper 画板

## 简介

`papaer_render` 具有基础的渲染方法。

`lib.js` 中有 `DrawInfo` 类，存储信息。

`paper_writter` 与 `paper_reader` 分别代表读者与写者，继承自 `papaer_render`。

接口已按照要求重新整理，`writter` 的消息通过 `callback` 进行 `dispatch` 传入 `reader` 内部。

目前只具有画线，橡皮，矩形，椭圆，清空的基础功能。清空是在外部绑定的数据。

打开 html 文件就可以直接体验了。

## 使用

`writter` 需要导入 `lib.js`, `paper_render.j`, `paper_writter` 三个文件。

`reader` 需要导入 `lib.js`, `paper_render.j`, `paper_reader` 三个文件。

## API

writer:

```js
let writter = new PaperWritter({
  el: '#writter',
  height: 600,
  width: 800,
  type: 'pen', //可根据需求需要绑定数据
  size: 1, //可根据需求需要绑定数据
  color: 'black', //可根据需求需要绑定数据
  /**
   * 用户绘制时的回调函数
   * @param {DrawEvent} di
   * */
  callback: function(di) {
      /**
       * 发生绘制事件时会触发回调函数
       * */
      reader.dispatch(di); //例子
      socket.send(url);
  }
});
```
reader:

```js
// 选中元素，设置大小即可
let reader = new PaperReader({
  el: '#reader',
  height: 650,
  width: 300
});
```

将来还有很多功能待补充。
