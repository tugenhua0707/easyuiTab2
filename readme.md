
### easyui 动态添加tab
####  HTML使用方式如下代码:
    <div id="tabContent1" style="display: none;"><div>adsasddasdasadsadsads</div></div>
    <div id="tabContent2" style="display: none;"><div>啊啊啊啊所大多所多撒奥多所无</div></div>
    <div id="tabContent3" style="display: none;"><div>adsasdqweqweqwwrrdfggffggf</div></div>
    <input text="number" id="inputId" style="width: 200px; height: 26px; border: 1px solid red;" />
    <div id="containerId"></div>
#### javascript调用方式如下：
    $("#inputId").keyup(function(e){
      var value = e.target.value - 0;
      if (value > 0) {
       var $panel = new AddTabs({
          value: value,
          prefixContent: 'tabContent',
          container: '#containerId',
          closedItemCallBack: function(obj){
            var len = obj.len;
            var $this = obj.$this;
            if (len === 0) {
              $("#inputId").val('');
            } else {
              $("#inputId").val(len);
            }
            $this.setValue(len);
          }
        });
      }
    });
<p>如上调用即可初始化。</p>
<h3>Javascript 相对应的API如下：</h3>

####  组件API
|      属性      |             说明                               |     类型        |     默认值     |
| --------------|:--------------------------------------------:  |   :-----------:| :-------------:|
|   container   |  tab项的容器[必须的参数]                          | [String]      |  ''             |
|   value       |  输入框的值[必须的参数]                            | [String]       |  ''            |
|   prefixContent| 内容的前缀类名                                | [String]       |  ''            |

####  回调方法
|     方法名           |         说明         |     返回参数                                           | 
| --------------------|:-------------------------:  |:--------------------------------------------: |
| closedItemCallBack  |  关闭tan某一项的回调          | Object {$this, title, index, len}| 

### 页面查看效果 预览如下地址
<p><a href="https://tugenhua0707.github.io/easyuiTab2/index.html" target="_blank">https://tugenhua0707.github.io/easyuiTab/index.html</a></p>