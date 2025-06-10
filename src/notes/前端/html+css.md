---
title: HTML

icon: logos:html-5

data: 2025-6-10

tags: [html,css,前端]
---



## html+css

### 让一个块水平（垂直）居中

方法一、方法二实现水平居中

方法一：

```html
#让bottom-list水平居中
<div class="bottom">
   <div class="bottom-list">
       这是一个测试行
    </div>
</div>
```

```css
#其生效的前提是bottom-list必须要有一个明确的宽度
margin:0 auto
#文字“这是一个测试行”并不会居中
如果想要bottom-list垂直居中呢？在bottom中使用line-height=height是不可行的，这种方法确实能让元素内部的文本垂直居中，但这种方法对非文本内容（如 div 子元素）没有效果，不过可以让bottom-list中的单行文本垂直居中
```

方法二：

```html
#父元素使用text-align：center可以使得子元素居中
#生效条件：子元素必须是文字、行内块、行内元素
#如果不是，需要使用display更改属性
<div class="test">
    <div class="test-inner">测试行</div>
    <ul>
        <li>nihao</li>
        <li>wohenhao</li>
    </ul>
</div>
```

```
.test{
text-align:center;
}
ul{
display:inline-block;
}
```

方法三（水平垂直居中）：

```html
<div class="outer">
        <div class="inner">
            <span>hello</span>
    </div>
</div>
```

1.使inner居中

```css
.outer{
    //使用弹性盒子布局，直接子元素变为弹性元素
    diaplay:flex;
    #主轴方向元素居中
    justify-content:center;
    #侧轴方向元素居中
    align-items:center;
}

```

2.令元素span中文字居中

```
.outer{
    //使用弹性盒子布局，直接子元素变为弹性元素
    diaplay:flex;
    #主轴方向元素居中
    justify-content:center;
    #侧轴方向元素居中
    align-items:center;
}
.inner{
	display:flex;
	    #主轴方向元素居中
    justify-content:center;
    #侧轴方向元素居中
    align-items:center;
}
```

![image-20250219194141313](.\assets\image-20250219194141313.png)

方法四（水平垂直居中）：

```html
<div class="outer">
        <div class="inner">
            <span>hello</span>
    </div>
</div>
```

1.使inner居中

```css
.outer{
    //使用弹性盒子布局，直接子元素变为弹性元素
    diaplay:flex;
    margin:auto;
}
```

2.令元素span中文字居中

```css
.outer{
    //使用弹性盒子布局，直接子元素变为弹性元素
    diaplay:flex;
    margin:auto;
}
.inner{
	display:flex;
    margin:auto;
}
```

