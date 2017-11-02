
function nestForm(cfg){
  this.init(cfg);
  // 绑定事件
  this.bindEnv();
}
nestForm.prototype = {
  init(cfg) {
    this.data = cfg.data || null;
    this.inputId = cfg.inputId;
    this.sameTabContent = cfg.sameTabContent;
    this.container = cfg.container;

    // 表单内的字段名称
    this.columns = ['title', 'type', 'content'];

    // name属性的 dayList 参数 比如 dataList[0].title 这样的，如果是其他名字的话，那么就改成其他名字
    this.listNames = 'dayList';

    // 有数据的话 说明是编辑页面 否则的话 是新增页面
    this.isEditor = data && data.list && data.list.length;
    // 是编辑页面 
    if (this.isEditor) {
      var value = this.data.num;
      this.initTab(value);
    }
  },
  bindEnv() {
    var self = this;
    $("#"+this.inputId).keyup(function(e) {
      var value = e.target.value - 0;
      if (value > 10) {
        throw new Error('tab项太多了，不能超过10项');
        return;
      }
      if (value > 0) {
       self.initTab(value);
      }
    });
    // 点击编辑
    $("#"+this.container).on('click', '.editcls span', function(e) {
      $(this).parent().removeClass('mask');
      var $panel = $(this).closest('.panel');
      var $index = $panel.attr('data-index');
      $panel.find('.dayList-operateType'+$index).val(2);
    });
  },
  initTab(value) {
    var self = this;
    var sameTabContent = '#' + self.sameTabContent;
    var container = '#' + self.container
    new AddTabs({
      value: value,
      sameTabContent: sameTabContent,
      container: container,
      initTabCallBack: function($this, title, index) {
        var panels = $this.find('.tabs-panels .panel').eq(index);
        // 设置form元素的name属性
        self.setFormElems(panels, title);
        // 渲染富文本编辑器
        self.renderKindeditor(panels, title);

        // 如果是编辑页面的时候
        if (self.isEditor) {
          // 更新表单的值
          self.updateFormValue(panels, title);

          // 更新编辑器内容
          self.updateKindeditorValue(panels, title);

          // 添加模板
          if ($(panels).find('.mask').length < 1) {
            $(panels).append('<div class="editcls mask"><span>编辑</span></div>');
          }
        }
      },
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
  },
  updateFormValue($panel, index) {
    var data = this.data;
    var columns = this.columns;
    var listNames = this.listNames;

    if (data.list && data.list.length) {
      var item = data.list[index - 1];
      for (var i = 0, ilen = columns.length; i < ilen; i++) {
        var name = columns[i];
        var newName = listNames+'[' + (index-1) +'].'+name;
        var val = item && item[name] ? item[name] : '';

        if ($($panel).find('input[name="'+newName+'"]').length) {
          $($panel).find('input[name="'+newName+'"]').val(val);
        }
        if ($($panel).find('select[name="'+newName+'"]').length) {
          if (val === '') {
            $($panel).find('select[name="'+newName+' option:first"]').prop("selected", "selected");
          } else {
            $($panel).find('select[name="'+newName+'"]').val(val);
          } 
        }
        if ($($panel).find('textarea[name="'+newName+'"]').length) {
          $($panel).find('textarea[name="'+newName+'"]').val(val);
        }
      }
      // 设置隐藏域的值
      if ($('.'+listNames+'-id'+(index - 1)).length > 0) {
        if (item && (item.id || (item.id == 0))) {
          $('.'+listNames+'-id'+(index - 1)).val(item.id);
        }
      }
      if ($('.'+listNames+'-customRouteId'+(index - 1)).length > 0) {
        if (item && (item.customRouteId || (item.customRouteId == 0))) {
          $('.'+listNames+'-customRouteId'+(index - 1)).val(item.customRouteId);
        }
      }
      if ($('.'+listNames+'-dayNum'+(index - 1)).length > 0) {
        if (item && (item.dayNum || (item.dayNum == 0))) {
          $('.'+listNames+'-dayNum'+(index - 1)).val(item.dayNum);
        }
      }
      if ($('.'+listNames+'-operateType'+(index - 1)).length > 0) {
        if (item && (item.operateType || (item.operateType == 0))) {
          $('.'+listNames+'-operateType'+(index - 1)).val(item.operateType);
        }
      }
    } else {
      throw new Error('列表数据为空');
    }
  },
  updateKindeditorValue($panel, index) {
    var curIndex = index - 1;
    var data = this.data;
    var editorElem = $panel.find('.ke-ed-content'+curIndex).eq(0);
    if (data.list && data.list.length) {
      var value = data.list[index - 1].content;
      KindEditor.html(editorElem, value);
    }
  },
  // 设置form元素的name属性 
  setFormElems($panel, title) {
    var columns = this.columns;
    var listNames = this.listNames;

    if (columns && columns.length) {
      for (var i = 0, ilen = columns.length; i < ilen; i++) {
        var name = columns[i];
        var cls = "ke-ed-"+ name + (title - 1);
        var newName = listNames+'[' + (title-1) +'].'+name;

        if ($($panel).find('input[name="'+name+'"]')) {
          $($panel).find('input[name="'+name+'"]').attr("name", newName).addClass(cls);
        }
        if ($($panel).find('select[name="'+name+'"]')) {
          $($panel).find('select[name="'+name+'"]').attr('name', newName).addClass(cls);
        }
        if ($($panel).find('textarea[name="'+name+'"]')) {
          $($panel).find('textarea[name="'+name+'"]').attr('name', newName).addClass(cls);
        }
        $($panel).attr('data-index', (title - 1));
      }
      var operateType;
      if (this.isEditor) {
        // 编辑页面
        operateType = 0;
      } else {
        // 新增页面
        operateType = 1;
      }
      var ihtml = '<input type="hidden" name="'+listNames+'['+(title - 1)+'].id" class="'+listNames+'-id'+(title - 1)+'"/>' + 
        '<input type="hidden" name="'+listNames+'['+(title - 1)+'].customRouteId" class="'+listNames+'-customRouteId'+(title - 1)+'"/>' + 
        '<input type="hidden" name="'+listNames+'['+(title - 1)+'].dayNum" class="'+listNames+'-dayNum'+(title - 1)+'"/>' +
        '<input type="hidden" name="'+listNames+'['+(title - 1)+'].operateType" class="'+listNames+'-operateType'+(title - 1)+'" value="'+operateType+'"/>';
      $($panel).find('.content').prepend(ihtml);
    }
  },
  renderKindeditor($panel, title) {
    var cls = '.ke-ed-content'+(title - 1);
    var editorElem = $(cls).eq(0);
    KindEditor.create(editorElem, {
      items: [
        'source', 'fontname', 'forecolor', 'fontsize', 'hilitecolor', 'bold', 'italic', 'underline' ,'hr',
        '|', 'emoticons', 'justifyleft', 'justifycenter', 'justifyright','insertorderedlist','insertunorderedlist','justifyfull', 'multiimage2','link', 'fullscreen', 'iphone'
      ],
      // uploadJson: '',  // 该配置是上传图片的地址
      pasteType: 1,      // 0 禁止黏贴 1 是纯文本黏贴 2 是html黏贴
      minHeight: 375
    });
  },
  // 提交时设置富文本编辑器值
  submitSetEditorValue() {
    var tabs = $('#'+this.container).find(".easyui-tabs .panel");
    $(tabs).each(function(index, item){
      var cls = '.ke-ed-content'+index;
      var editorElem = $(cls).eq(0);
      KindEditor.sync(editorElem);
      var editorValue = editorElem.val();
      $(cls).eq(0).val(editorValue);
    });
  }
};
