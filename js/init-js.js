(function($){
  "use strict";
  var demoWrapper = function(data){
    return '<body><form id="submitform" action="sample/back.html"><input id="tos" name="tos" type="checkbox">' +
           '<label for="tos">我已詳閱並接受<a href="http://zh.wikipedia.org/zh-tw/%E5%87%BA%E5%B8%AB%E8%A1%A8">前出師表</a>。</label>' +
           '<input type="submit" value="送出">' +
           '</form><script type="text/javascript">' + data + '</script></body>';
  };

  $('script[type="text/x-sample"]').each(function(){
    var $this = $(this), option = {};
    if($this.hasClass('nopreview')){
      option.preview = false;
    }
    if($this.hasClass('demo')){
      option.wrapper = demoWrapper;
    }

    $this.sample(option);
  });

}(jQuery));