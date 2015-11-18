var $, ElixirDocsView, View, ref;

ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

module.exports = ElixirDocsView = (function() {
  function ElixirDocsView(serializedState) {
    var scroller, scrollhandler;
    this.element = document.createElement('div');
    this.element.classList.add('elixir-docs');
    this.element.classList.add('elixir-docs-resizer');
    this.element.classList.add('tool-panel');
    this.element.classList.add('native-key-bindings');
    this.element.setAttribute("tabindex", -1);
    scrollhandler = document.createElement('div');
    scrollhandler.classList.add('elixir-docs-scroller');
    this.element.appendChild(scrollhandler);
    this.body = document.createElement('div');
    this.body.classList.add('body');
    this.body.classList.add('focusable-panel');
    scrollhandler.appendChild(this.body);
    scroller = document.createElement('div');
    scroller.classList.add('elixir-docs-resize-handle');
    this.element.appendChild(scroller);
  }

  ElixirDocsView.prototype.serialize = function() {
    return {};
  };

  ElixirDocsView.prototype.destroy = function() {
    return this.element.remove();
  };

  ElixirDocsView.prototype.getElement = function() {
    return this.element;
  };

  return ElixirDocsView;

})();
