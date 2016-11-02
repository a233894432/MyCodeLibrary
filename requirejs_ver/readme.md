# requirejs加载文件带上 md5 版本号的 解决方案

> 请在 requrie.js 加载之前，提供一个全局变量 require：
 
MjAxMTAxMTQyNQ==

```js
<script>
  var require = {
            urlArgs: 'v=版本号'
    };
</script>

<script src="scripts/require.js"></script>
```