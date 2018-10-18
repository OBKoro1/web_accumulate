(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{181:function(t,s,n){"use strict";n.r(s);var a=n(0),e=Object(a.a)({},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"content"},[t._m(0),t._v(" "),n("p",[t._v("起因是因为想了解闭包的内存泄露机制，然后想起《js高级程序设计》中有关于垃圾回收机制的解析，之前没有很懂，过一年回头再看就懂了，写篇博客与大家分享一下。")]),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),t._m(4),t._v(" "),t._m(5),t._v(" "),t._m(6),t._v(" "),n("hr"),t._v(" "),t._m(7),t._v(" "),n("p",[t._v("在C和C++之类的语言中，需要手动来管理内存的，这也是造成许多不必要问题的根源。幸运的是，在编写js的过程中，内存的分配以及内存的回收完全实现了自动管理，我们不用操心这种事情。")]),t._v(" "),t._m(8),t._v(" "),t._m(9),t._v(" "),t._m(10),t._v(" "),n("p",[t._v("不再使用的变量也就是生命周期结束的变量，是局部变量，局部变量只在函数的执行过程中存在，当函数运行结束，没有其他引用(闭包)，那么该变量会被标记回收。")]),t._v(" "),t._m(11),t._v(" "),t._m(12),t._v(" "),n("p",[t._v("工作原理：")]),t._v(" "),n("p",[t._v("当变量进入环境时(例如在函数中声明一个变量)，将这个变量标记为“进入环境”，当变量离开环境时，则将其标记为“离开环境”。标记“离开环境”的就回收内存。")]),t._v(" "),n("p",[t._v("工作流程：")]),t._v(" "),t._m(13),t._v(" "),t._m(14),t._v(" "),t._m(15),t._v(" "),n("p",[t._v("循环引用：跟踪记录每个值被引用的技术")]),t._v(" "),n("p",[t._v("在老版本的浏览器中(对，又是IE)，IE9以下BOM和DOM对象就是使用C++以COM对象的形式实现的。")]),t._v(" "),n("p",[t._v("COM的垃圾收集机制采用的就是引用计数策略，这种机制在出现循环引用的时候永远都释放不掉内存。")]),t._v(" "),t._m(16),n("p",[t._v("解决方式是，当我们不使用它们的时候，手动切断链接：")]),t._v(" "),t._m(17),t._m(18),t._v(" "),n("p",[t._v("IE9把BOM和DOM对象转为了真正的js对象，避免了使用这种垃圾收集策略，消除了IE9以下常见的内存泄漏的主要原因。")]),t._v(" "),n("p",[t._v("IE7以下有一个声明狼藉的性能问题，大家了解一下：")]),t._v(" "),t._m(19),t._v(" "),n("p",[t._v("IE7已修复这个问题。")]),t._v(" "),n("hr"),t._v(" "),t._m(20),t._v(" "),n("p",[t._v("虽然有垃圾回收机制，但我们在编写代码的时候，有些情况还是会造成内存泄漏，了解这些情况，并在编写程序的时候，注意避免，我们的程序会更具健壮性。")]),t._v(" "),t._m(21),t._v(" "),t._m(22),t._v(" "),t._m(23),n("p",[t._v("当我们使用"),n("a",{attrs:{href:"https://juejin.im/post/5b3715def265da59af40a630#heading-3",target:"_blank",rel:"noopener noreferrer"}},[t._v("默认绑定"),n("OutboundLink")],1),t._v("，this会指向全局，"),n("code",[t._v("this.something")]),t._v("也会创建一个全局变量，这一点可能很多人没有注意到。")]),t._v(" "),t._m(24),t._v(" "),t._m(25),t._m(26),t._v(" "),t._m(27),t._m(28),t._v(" "),t._m(29),t._v(" "),t._m(30),t._m(31),t._v(" "),t._m(32),t._v(" "),t._m(33),t._v(" "),t._m(34),t._m(35),t._v(" "),t._m(36),t._v(" "),n("p",[t._v("就是IE9以下的循环引用问题，上文讲过了。")]),t._v(" "),t._m(37),t._v(" "),t._m(38),n("p",[t._v("不信的话，可以看下这个"),n("a",{attrs:{href:"https://codepen.io/OBKoro1/pen/vroKbg",target:"_blank",rel:"noopener noreferrer"}},[t._v("dom"),n("OutboundLink")],1),t._v("。")]),t._v(" "),t._m(39),t._v(" "),t._m(40),t._v(" "),n("p",[t._v("过多的console，比如定时器的console会导致浏览器卡死。")]),t._v(" "),t._m(41),t._v(" "),n("hr"),t._v(" "),t._m(42),t._v(" "),t._m(43),t._v(" "),t._m(44),t._v(" "),t._m(45),t._v(" "),t._m(46),t._v(" "),t._m(47),t._v(" "),n("ol",{attrs:{start:"3"}},[n("li",[t._v("使用chorme监控内存泄漏，可以看一下这篇"),n("a",{attrs:{href:"https://jinlong.github.io/2016/05/01/4-Types-of-Memory-Leaks-in-JavaScript-and-How-to-Get-Rid-Of-Them/",target:"_blank",rel:"noopener noreferrer"}},[t._v("文章"),n("OutboundLink")],1)])]),t._v(" "),t._m(48),t._v(" "),n("p",[t._v("了解了内存泄漏的原因以及出现的情况，那么我们在编码过程中只要多加注意，就不会发生非常严重的内存泄漏问题。")]),t._v(" "),t._m(49),t._v(" "),n("p",[t._v("觉得还不错的话，给我的点个"),n("a",{attrs:{href:"https://github.com/OBKoro1/Brush_algorithm",target:"_blank",rel:"noopener noreferrer"}},[t._v("star"),n("OutboundLink")],1),t._v("吧")]),t._v(" "),n("p",[t._v("游泳、健身了解一下："),n("a",{attrs:{href:"http://obkoro1.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("博客"),n("OutboundLink")],1),t._v("、"),n("a",{attrs:{href:"https://github.com/OBKoro1/Brush_algorithm",target:"_blank",rel:"noopener noreferrer"}},[t._v("前端算法"),n("OutboundLink")],1),t._v("、"),n("a",{attrs:{href:"https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317",target:"_blank",rel:"noopener noreferrer"}},[t._v("公众号"),n("OutboundLink")],1)])])},[function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"js高程中的垃圾回收机制与常见内存泄露的解决方法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#js高程中的垃圾回收机制与常见内存泄露的解决方法","aria-hidden":"true"}},[this._v("#")]),this._v(" JS高程中的垃圾回收机制与常见内存泄露的解决方法")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"内存的生命周期："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#内存的生命周期：","aria-hidden":"true"}},[this._v("#")]),this._v(" 内存的生命周期：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",[s("li",[this._v("分配你所需要的内存：")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("由于字符串、对象等没有固定的大小，js程序在每次创建字符串、对象的时候，程序都会"),s("strong",[this._v("分配内存来存储那个实体")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",{attrs:{start:"2"}},[s("li",[s("p",[this._v("使用分配到的内存做点什么。")])]),this._v(" "),s("li",[s("p",[this._v("不需要时将其释放回归：")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("在不需要字符串、对象的时候，需要释放其所占用的内存，否则将会消耗完系统中所有可用的内存，造成系统崩溃，这就是"),s("strong",[this._v("垃圾回收机制所存在的意义")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("所谓的内存泄漏指的是")]),this._v("：由于疏忽或错误造成程序未能释放那些已经不再使用的内存，造成内存的浪费。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"垃圾回收机制："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#垃圾回收机制：","aria-hidden":"true"}},[this._v("#")]),this._v(" 垃圾回收机制：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"垃圾收集机制的原理："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#垃圾收集机制的原理：","aria-hidden":"true"}},[this._v("#")]),this._v(" 垃圾收集机制的原理：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("垃圾收集器会按照固定的时间间隔，"),s("strong",[this._v("周期性的找出不再继续使用的变量，然后释放其占用的内存")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("什么叫不再继续使用的变量？")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("全局变量的生命周期直至浏览器卸载页面才会结束，也就是说"),s("strong",[this._v("全局变量不会被当成垃圾回收")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"标记清除：当前采用的垃圾收集策略"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#标记清除：当前采用的垃圾收集策略","aria-hidden":"true"}},[this._v("#")]),this._v(" 标记清除：当前采用的垃圾收集策略")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ol",[n("li",[t._v("垃圾收集器会在运行的时候会给存储在内存中的"),n("strong",[t._v("所有变量都加上标记")]),t._v("。")]),t._v(" "),n("li",[n("strong",[t._v("去掉环境中的变量")]),t._v("以及被环境中的变量引用的变量的标记。")]),t._v(" "),n("li",[t._v("那些"),n("strong",[t._v("还存在标记的变量被视为准备删除的变量")]),t._v("。")]),t._v(" "),n("li",[t._v("最后垃圾收集器会执行最后一步内存清除的工作，"),n("strong",[t._v("销毁那些带标记的值并回收它们所占用的内存空间")]),t._v("。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("到2008年为止,IE、Chorme、Fireofx、Safari、Opera "),s("strong",[this._v("都使用标记清除式的垃圾收集策略")]),this._v("，只不过垃圾收集的时间间隔互有不同。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"引用计数略：被废弃的垃圾收集策略"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#引用计数略：被废弃的垃圾收集策略","aria-hidden":"true"}},[this._v("#")]),this._v(" 引用计数略：被废弃的垃圾收集策略")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" element "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("getElementById")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v("'something'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" myObject "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{attrs:{class:"token class-name"}},[t._v("Object")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nmyObject"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("element "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" element"),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{attrs:{class:"token comment"}},[t._v("// element属性指向dom")]),t._v("\nelement"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("someThing "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" myObject"),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{attrs:{class:"token comment"}},[t._v("// someThing回指myObject 出现循环引用(两个对象一直互相包含 一直存在计数)。")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br")])])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[t._v("myObject"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("element "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("null")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \nelement"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("someThing "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("null")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("淘汰")]),this._v("：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",[s("li",[this._v("256个变量，4096个对象(或数组)字面或者64KB的字符串，达到任何一个临界值会触发垃圾收集器运行。")]),this._v(" "),s("li",[this._v("如果一个js脚本的生命周期一直保有那么多变量，垃圾收集器会一直频繁的运行，引发严重的性能问题。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"哪些情况会引起内存泄漏？"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#哪些情况会引起内存泄漏？","aria-hidden":"true"}},[this._v("#")]),this._v(" 哪些情况会引起内存泄漏？")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"意外的全局变量："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#意外的全局变量：","aria-hidden":"true"}},[this._v("#")]),this._v(" 意外的全局变量：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("上文我们提到了"),s("strong",[this._v("全局变量不会被当成垃圾回收")]),this._v("，我们在编码中有时会出现下面这种情况：")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("foo")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bar2 "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'默认绑定this指向全局'")]),t._v(" "),n("span",{attrs:{class:"token comment"}},[t._v("// 全局变量=> window.bar2")]),t._v("\n    bar "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'全局变量'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{attrs:{class:"token comment"}},[t._v("// 没有声明变量 实际上是全局变量=>window.bar")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("foo")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("解决方法：在函数内使用严格模式or细心一点")])])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("foo")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token string"}},[t._v('"use strict"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n    "),n("span",{attrs:{class:"token keyword"}},[t._v("this")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bar2 "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v('"严格模式下this指向undefined"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n    bar "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v('"报错"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("foo")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("当然我们也可以"),s("strong",[this._v("手动释放全局变量的内存")]),this._v("：")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[t._v("window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bar "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" undefined\n"),n("span",{attrs:{class:"token keyword"}},[t._v("delete")]),t._v(" window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bar2\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"被遗忘的定时器和回调函数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#被遗忘的定时器和回调函数","aria-hidden":"true"}},[this._v("#")]),this._v(" 被遗忘的定时器和回调函数")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("p",[t._v("当"),n("strong",[t._v("不需要")]),n("code",[t._v("setInterval")]),t._v("或者"),n("code",[t._v("setTimeout")]),t._v("时，"),n("strong",[t._v("定时器没有被clear")]),t._v("，定时器的"),n("strong",[t._v("回调函数以及内部依赖的变量都不能被回收")]),t._v("，造成内存泄漏。")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" someResource "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("getData")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{attrs:{class:"token function"}},[t._v("setInterval")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token keyword"}},[t._v("function")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" node "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("getElementById")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v("'Node'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("node"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        node"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHTML "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token constant"}},[t._v("JSON")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("stringify")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("someResource"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{attrs:{class:"token comment"}},[t._v("// 定时器也没有清除")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{attrs:{class:"token comment"}},[t._v("// node、someResource 存储了大量数据 无法回收")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token number"}},[t._v("1000")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("解决方法")]),this._v("： 在定时器完成工作的时候，手动清除定时器。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"闭包："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#闭包：","aria-hidden":"true"}},[this._v("#")]),this._v(" 闭包：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("闭包可以维持函数内局部变量，使其得不到释放，造成内存泄漏")]),this._v("。")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("bindEvent")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" obj "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("createElement")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v('"XXX"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" "),n("span",{attrs:{class:"token function-variable function"}},[t._v("unused")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        console"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("log")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("obj"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{attrs:{class:"token string"}},[t._v("'闭包内引用obj obj不会被释放'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token comment"}},[t._v("// obj = null;")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("解决方法")]),this._v("：手动解除引用，"),s("code",[this._v("obj = null")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"循环引用问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#循环引用问题","aria-hidden":"true"}},[this._v("#")]),this._v(" 循环引用问题")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"没有清理dom元素引用："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#没有清理dom元素引用：","aria-hidden":"true"}},[this._v("#")]),this._v(" 没有清理DOM元素引用：")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" refA "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("getElementById")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v("'refA'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\ndocument"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("body"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("removeChild")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("refA"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{attrs:{class:"token comment"}},[t._v("// dom删除了")]),t._v("\nconsole"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("log")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("refA"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v('"refA"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),n("span",{attrs:{class:"token comment"}},[t._v("// 但是还存在引用 能console出整个div 没有被回收")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("解决办法")]),this._v("："),s("code",[this._v("refA = null")]),this._v(";")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"console保存大量数据在内存中。"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#console保存大量数据在内存中。","aria-hidden":"true"}},[this._v("#")]),this._v(" console保存大量数据在内存中。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("解决")]),this._v("：合理利用console，线上项目尽量少的使用console，当然如果你要发招聘除外。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"如何避免内存泄漏："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如何避免内存泄漏：","aria-hidden":"true"}},[this._v("#")]),this._v(" 如何避免内存泄漏：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[s("strong",[this._v("记住一个原则：不用的东西，及时归还，毕竟你是'借的'嘛")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",[s("li",[this._v("减少不必要的全局变量，使用严格模式避免意外创建全局变量。")]),this._v(" "),s("li",[this._v("在你使用完数据后，及时解除引用(闭包中的变量，dom引用，定时器清除)。")]),this._v(" "),s("li",[this._v("组织好你的逻辑，避免死循环等造成浏览器卡顿，崩溃的问题。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"关于内存泄漏："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#关于内存泄漏：","aria-hidden":"true"}},[this._v("#")]),this._v(" 关于内存泄漏：")])},function(){var t=this.$createElement,s=this._self._c||t;return s("ol",[s("li",[this._v("即使是1byte的内存，也叫内存泄漏，并不一定是导致浏览器崩溃、卡顿才能叫做内存泄漏。")]),this._v(" "),s("li",[this._v("一般是堆区内存泄漏，栈区不会泄漏。")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("基本类型的值存在内存中，被保存在栈内存中，引用类型的值是对象，保存在堆内存中。所以"),s("strong",[this._v("对象、数组之类的，才会发生内存泄漏")]),this._v("。")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"小结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#小结","aria-hidden":"true"}},[this._v("#")]),this._v(" 小结")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h3",{attrs:{id:"鼓励我一下："}},[s("a",{staticClass:"header-anchor",attrs:{href:"#鼓励我一下：","aria-hidden":"true"}},[this._v("#")]),this._v(" 鼓励我一下：")])}],!1,null,null,null);e.options.__file="js垃圾回收机制.md";s.default=e.exports}}]);