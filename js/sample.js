/*global CodeMirror, hljs */
(function($, undefined){
  "use strict";

  // cached DOM elements
  var $sampleContainerSrc = $('<div class="sample-container"></div>'),
      $codeSrc = $('<code contenteditable></code>'),
      $preSrc = $('<pre></pre>'),
      $iframeSrc = $('<div class="iframe"><iframe></iframe></div>'),
      $updateBtnSrc = $('<button>&raquo;</button>'),

      updateIframe = function(iframe, $pre, wrapper){
        var doc = iframe.contentDocument,
            height = $pre.height() || 200;
        doc.open(); doc.writeln( wrapper($pre.text()) ); doc.close();
        $(iframe).height(height);
        // highligt the code
        hljs.highlightBlock($pre.find('code').get(0));
      };

  // example usage:
  // $('script[type=text/x-sample]').sample();
  //
  $.fn.sample = function(options){
    // 'this' should be <script> jQuery object
    //

    // method invokation
    if(typeof arguments[0] === 'string'){
      var args = arguments;
      this.each(function(){
        var method = $(this).data('sample')[options];
        method.apply(this, Array.prototype.slice.call(args,1));
      });
      return; // do not execute the init part below
    }

    options = $.extend({
      wrapper: function(lines){ // default wrapper: no-op
        return lines;
      }
    }, options);

    this.each(function(){
      var
      indent = 100, // shortest indent
      lines = $(this).html().split('\n'); // lines of code

      // finding indent
      $.each(lines, function(){
        var space = this.search(/[^ ]/);
        if(space>0){
          indent = Math.min(space, indent);
        }
      });

      // removing indent & empty lines
      lines = $.map(lines, function(l){
        return l.substr(indent);
      });

      // remove leading & trailing empty lines
      while(lines[0] === ''){
        lines.shift();
      }
      while(lines[lines.length-1] === ''){
        lines.pop();
      }

      // join lines
      lines = lines.join('\n');


      // output stage
      //
      // the container of all the elements, and
      // insert the container below the script tag.
      var $sampleContainer = $sampleContainerSrc.clone()
                                                .insertAfter(this);

      // append the code and append it to the container.
      var $code = $codeSrc.clone().text(lines),
          $pre = $preSrc.clone().append($code).appendTo($sampleContainer);


      // previewing iframe
      var iframe = $iframeSrc.clone().appendTo($sampleContainer).find('iframe').get(0);
      $(iframe).ready(function(){
        updateIframe(iframe, $pre, options.wrapper);
      });

      // update button
      var $updateBtn = $updateBtnSrc.clone().insertAfter($pre);
      $updateBtn.click(function(){
        // updating iframe and highlight the $pre again
        updateIframe(iframe, $pre, options.wrapper);
      });


      // install methods to data('sample')
      $(this).data('sample', {
        update: function(){
          updateIframe(iframe, $pre, options.wrapper);
        }
      });
    });
  }
}(jQuery));