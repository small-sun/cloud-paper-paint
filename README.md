# cloud-paper-paint
cloud-paper 画板

`paper_writter` 与 `paper_reader` 分别代表读者与写者。

写者做的还好，读者就非常简陋了……

由于没有后端，使用 `message` 这个全局变量作为消息变量，写者那边触发事件就会推到消息队列里，读者这边是每隔一段时间去拉取消息，然后根据读者的 canvas 的大小会进行放缩。

打开 html 文件就可以直接体验了。

将来还有很多功能待补充。
