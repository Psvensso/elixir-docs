var $ = require("jquery")
, modalPanel
, CompositeDisposable = require('atom').CompositeDisposable
, ElixirDocs
, ElixirDocsView = require('./elixir-docs-view')
, elixirDocsView
, subscriptions
, Process = require("atom").BufferedProcess
, autocomplete
, fs = require('fs')
, marked = require('marked')
, inp
, path = require('path')
, projectPaths
, spawn = require('child_process').spawn;
var regs = {
  iex: /^iex\([1-9]{1,}\)>$/,
  start: /^Interactive Elixir/
}
function handleIexResponse(a){
  console.log(a);
  if(!a){
    return;
  }
  if(!a.trim().match(/^iex\([1-9]{1,}\)>$/) && a.indexOf("Interactive Elixir") === -1 && a.indexOf("Eshell") === -1){
    updateText(a);
  }
}

function updateText(text){
  $('.elixir-docs .focusable-panel').html(marked(text));
}

function resizeStarted() {
  $(document).on('mousemove', resizeTreeView);
  return $(document).on('mouseup', resizeStopped);
};

function resizeTreeView(e) {
  $('.elixir-docs').width(window.innerWidth - e.clientX);
};

function resizeStopped() {
  $(document).off('mousemove', resizeTreeView);
  $(document).off('mouseup', resizeStopped);
};

function toggle() {
  if (modalPanel.isVisible()) {
    return modalPanel.hide();
  } else {
    return modalPanel.show();
  }
}

function findhelp() {
  updateText("");
  var txt = atom.workspace.getActiveTextEditor().getSelectedText();
  var term = "h("+txt+") \n";
  console.log(term);
  inp.write(term);
}



function openTerminal() {
  pro = new Process({
    command: "iex",
    args: null,
    stderr: function(e) {
      return lastError = e;
    },
    exit: function(e) {
      return console.error("CLOSED " + e + ", Last Error: " + lastError);
    },
    stdout: function() {}
  });
  //atom.notifications.addInfo(editor = atom.workspace.getActivePaneItem().getSelectedText());
  inp = pro.process.stdin;
  pro.process.stdout.on("data", handleIexResponse);
}

module.exports = ElixirDocs = {
  elixirDocsView: elixirDocsView,
  modalPanel: modalPanel,
  subscriptions: subscriptions,
  activate: function (state) {
    console.log(state);
    elixirDocsView = new ElixirDocsView(state.elixirDocsViewState)

    modalPanel = atom.workspace.addRightPanel({
      item: elixirDocsView.getElement(),
      visible: false
    });

    subscriptions = new CompositeDisposable;

    $('.elixir-docs-resize-handle').on('mousedown', resizeStarted);
    subscriptions.add(atom.commands.add('atom-workspace', {'elixir-docs:finddoc': findhelp}));
    subscriptions.add(atom.commands.add('atom-workspace', {'elixir-docs:toggle': toggle}));
    openTerminal();
  },

  deactivate: function() {
    modalPanel.destroy();
    subscriptions.dispose();
    return elixirDocsView.destroy();
  },
  serialize: function() {
    return {
      elixirDocsViewState: elixirDocsView.serialize()
    };
  }
};
