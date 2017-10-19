
/*
 * easyui 动态增加tab项
*/
function AddTabs(cfg) {

  // tab项的容器
  this.container = cfg.container;

  // 关闭一项的回调
  this.closedItemCallBack = cfg.closedItemCallBack || null;

  if (!cfg.container) {
    throw new Error('tab项的容器不能为空');
    return;
  }
  // 输入框的值
  var reg = /^\d+$/g;
  if (!reg.test(cfg.value)) {
    // 如果不是数字的话, 直接返回
    throw new Error('值需要是纯数字');
    return;
  }
  this.value = cfg.value - 0;

  // 内容容器的前缀
  this.prefixContent = cfg.prefixContent;

  this.addTabs();
  return this;
}
AddTabs.prototype.constructor = AddTabs;
AddTabs.prototype.addTabs = function() {
  var self = this;
  var values = this.value;
  var container = this.container;
  $(container).html('');
  var $tabs = $('<div class="easyui-tabs" style="width:400px;height:250px;"></div>');
  $(container).append($tabs);
  if (values >= 0) {
    for (var i = 0; i < values; i++) {
      var title = (i+1);
      var content = $('#' + this.prefixContent + title).html();
      $($tabs).tabs({
        onAdd: function() {
          var $this = $(this);
          if($this.find('.tabs-wrap .arrow_icon').length < 1) {
            $this.find('.tabs-wrap').append('<i class="arrow_icon"></i>');
          }
          // 面板的展开与收缩
          self.panelUpAndDown($this);
        },
        onClose: function(title, index){
          if ($($tabs).tabs('tabs').length === 0) {
            setTimeout(function(){
              $(container).html('');
            }, 50);
          }
          var obj = {
            $this: self,
            title: title,
            index: index,
            len: $($tabs).tabs('tabs').length
          };
          setTimeout(function(){
            self.closedItemCallBack && $.isFunction(self.closedItemCallBack) && self.closedItemCallBack(obj);
          }, 40);
        }
      });
      $($tabs).tabs('add', {
        title: title,
        content: content,
        closable: true
      });
    }
  }
};
AddTabs.prototype.panelUpAndDown = function($this) {
  // 面板收缩与展开
  $this.find('.arrow_icon').unbind('click').bind('click', function(){
    var $$this = $(this);
    if (!$$this.hasClass('up')) {
      $$this.addClass('up');
      $this.find('.tabs-panels').slideUp('normal', function(){});
    } else {
      $$this.removeClass('up');
      $this.find('.tabs-panels').slideDown('normal', function(){});
    }
  });
};
AddTabs.prototype.setValue = function(value) {
  if (value > 0) {
    this.value = value;
  }
  this.addTabs();
};
AddTabs.prototype.getValue = function() {
  return this.value;
};