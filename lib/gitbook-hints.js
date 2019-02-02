(function(extension) {
  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }
})(function(showdown) {
  // loading extension into showdown
  showdown.extension('gitbook-hints', function() {
    const gitbookHints = {
      type: 'lang',
      regex: /{% hint style="(\w*?)" %}([\s\S]*?){% endhint %}/gm,
      replace: (match, className, content) =>
        [
          `<div class="hint hint--${className}">`,
          '\n',
          new showdown.Converter().makeHtml(content),
          '\n',
          '</div>',
        ].join(''),
    };
    return [gitbookHints];
  });
});
