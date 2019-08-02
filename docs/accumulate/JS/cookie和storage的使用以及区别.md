## cookie、localStorage 和 sessionStorage 的使用以及区别

### localStorage 和 sessionStorage 的增删改查：

1. **存储数据**：

   ```js
   sessionStorage.setItem('key', 'sessionStorage的值'); // 存储数据
   ```
2. **获取指定键名数据**：

    ```js
    let dataSession=sessionStorage.getItem('key');//获取指定键名数据
    let dataSession2=sessionStorage.key;//sessionStorage是js对象，也可以使用key的方式来获取值
    console.log(dataSession,dataSession2,'获取指定键名数据');
    ```

3. **获取sessionStorage全部数据**：

    ```js
    let dataAll = sessionStorage.valueOf(); //获取全部数据
    console.log(dataAll, '获取全部数据');
    ```

4. **清空sessionStorage数据**： 

    ```js
    sessionStorage.clear();//清空
    ```

::: tip localStorage
只要将`sessionStorage`替换成`localStorage`即可，他们两个的使用方法完全是一样的。
:::

### cookie 的增删改茶:

1. **保存 cookie 值：**

   ```js
   let dataCookie = '110';
   document.cookie = 'token' + '=' + dataCookie;
   ```

2. **获取指定名称的 cookie 值**

   ```js
   let cookieData = getCookie('token');
   function getCookie(name) {
     // 获取指定名称的cookie值
     let arr = document.cookie.match(
       new RegExp('(^| )' + name + '=([^;]*)(;|$)')
     ); // 使用正则匹配 对应cookie，返回数组
     if (arr != null) {
       console.log(arr);
       return unescape(arr[2]);
     }
     return null;
   }
   let cookieData = getCookie('token'); // cookie赋值给变量。
   ```

3. 保存 cookie 并且设置过期时间：

   ```js
   setTime('token','cookie的值',10);
   function setTime(key,value,expiresDays) {
       //存储 cookie 值并且设置 cookie 过期时间
       let date=new Date();
       date.setTime(date.getTime()+expiresDays*24*3600\*1000);
           document.cookie=`${key}=${value}; expires=${date.toGMTString()}`;
       console.log(document.cookie,'存储 cookie 值并且设置 cookie 过期时间');
   }
   ```

4. 删除 cookie:

   ```js
   delCookie('token');
   function delCookie(cookieName1) {
     //删除cookie
     let date2 = new Date();
     date2.setTime(date2.getTime() - 10001); //把时间设置为过去的时间，会自动删除
     document.cookie = cookieName1 + '=v; expires=' + date2.toGMTString();
     console.log(document.cookie, '删除cookie');
   }
   ```

---

### 三者的异同：

这个问题其实很多大厂面试的时候也都会问到，所以可以注意一下这几个之间的区别：

**生命周期**：

cookie：可设置失效时间，没有设置的话，默认是关闭浏览器后失效

localStorage：除非被手动清除，否则将会永久保存。

sessionStorage： 仅在当前网页会话下有效，关闭页面或浏览器后就会被清除。

**存放数据大小**：

cookie：4KB左右

localStorage和sessionStorage：可以保存5MB的信息。

**http请求**：

cookie：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题

localStorage和sessionStorage：仅在客户端（即浏览器）中保存，不参与和服务器的通信

**易用性**：

cookie：需要程序员自己封装，源生的Cookie接口不友好

localStorage和sessionStorage：源生接口可以接受，亦可再次封装来对Object和Array有更好的支持

---

### 应用场景：

从安全性来说，因为每次http请求都会携带cookie信息，这样无形中浪费了带宽，所以cookie应该尽可能少的使用，另外cookie还需要指定作用域，不可以跨域调用，限制比较多。但是用来识别用户登录来说，cookie还是比stprage更好用的。其他情况下，可以使用storage，就用storage。

storage在存储数据的大小上面秒杀了cookie，现在基本上很少使用cookie了，因为更大总是更好的，哈哈哈你们懂得。

localStorage和sessionStorage唯一的差别一个是永久保存在浏览器里面，一个是关闭网页就清除了信息。localStorage可以用来夸页面传递参数，sessionStorage用来保存一些临时的数据，防止用户刷新页面之后丢失了一些参数。


### 浏览器支持情况：

localStorage和sessionStorage是html5才应用的新特性，可能有些浏览器并不支持，这里要注意。

![](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/15ff2d54764e53af?raw=true)

cookie的浏览器支持没有找到，可以通过下面这段代码来判断所使用的浏览器是否支持cookie：

    if(navigator.cookieEnabled) {
      alert("你的浏览器支持cookie功能");//提示浏览器支持cookie  
    } else {
      alert("你的浏览器不支持cookie");//提示浏览器不支持cookie   }

### 数据存放处：

![Cookie、localStorage、sessionStorage数据存放处](https://github.com/OBKoro1/articleImg_src/blob/master/juejin/15ff2f727028f37b?raw=true)


### 番外：各浏览器Cookie大小、个数限制。

cookie 使用起来还是需要小心一点，有兴趣的可以看一下这个[链接](https://www.cnblogs.com/henryhappier/archive/2011/03/03/1969564.html)。
<!-- 特殊字符串：用于修改/删除markdown的结尾提示语-OBKoro1 -->
### 点个[Star](https://github.com/OBKoro1/web_accumulate)支持我一下~

<!-- '特殊字符串：用于删除编译后的issue组件-OBKoro1 -->
<!-- more -->
<comment-comment/>
