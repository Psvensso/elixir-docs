var $ = require("jquery"),
modalPanel,
CompositeDisposable = require('atom').CompositeDisposable,
ElixirDocs,
ElixirDocsView = require('./elixir-docs-view'),
elixirDocsView,
subscriptions,
Process = require("atom").BufferedProcess,
autocomplete,
iexProcess,
fs = require('fs'),
marked = require('marked'),
inp,
path = require('path'),
projectPaths,
lastError = null,
isNoMixProject = false,
spawn = require('child_process').spawn;
var regs = {
  iex: /^iex\([1-9]{1,}\)>$/,
  start: /^Interactive Elixir/
};
function handleIexResponse(a){
  if(!a){
    return;
  }

  var hasTerminalStatement = a.trim().match(/^(iex\([1-9]{1,}\)>)/);
  var hasInteractiveText= a.indexOf("Interactive Elixir") > -1;
  var hasEshellText = a.indexOf("Eshell") > -1;
  if(!hasTerminalStatement && !hasInteractiveText && !hasEshellText){
    updateText(a);
  }
}

function updateText(text){
  var header = "";
  header += "### Elixir Docs \n";
  if(isNoMixProject){
    header += "* standard lib only \n ";
  }
  $('.elixir-docs .focusable-panel').html(marked(header += text));
}

function resizeStarted() {
  $(document).on('mousemove', resizeTreeView);
  return $(document).on('mouseup', resizeStopped);
}

function resizeTreeView(e) {
  $('.elixir-docs').width(window.innerWidth - e.clientX);
}

function resizeStopped() {
  $(document).off('mousemove', resizeTreeView);
  $(document).off('mouseup', resizeStopped);
}

function toggle() {
  if(!!iexProcess){
    openTerminal();
  }
  updateText("");
  if (modalPanel.isVisible()) {
    return modalPanel.hide();
  } else {
    return modalPanel.show();
  }
}

function findhelp() {
  modalPanel.show();
  updateText("");
  var txt = atom.workspace.getActiveTextEditor().getSelectedText();
  var term = "h("+ txt +")\n";
  inp.write(term);
}

function openTerminal(failSafer) {

  if(typeof iexProcess !== "undefined" && iexProcess.killed === false){
    iexProcess.kill(0);
  }

  var p = atom.project.getPaths()[0] || "";
  var elixirHome = atom.config.get("elixir-docs.elixirHome")
  var args = !!failSafer ? [] : ["-S", path.join((elixirHome || ""), "mix")];
  var command = path.join((elixirHome || ""), "iex")
  erlPath = atom.config.get("elixir-docs.erlangHome")

  var env = process.env
  env["ERL_HOME"] = erlPath
  env["ERL_PATH"] = path.join(erlPath, 'erl')

  iexProcess = new Process({
    options: {
      cwd: path.normalize(p),
      env: env
    },
    command: command,
    args: args,
    stderr: function(e) {
      if(e.indexOf("Could not find a Mix.Project") > -1){
        isNoMixProject = true;
        openTerminal(true);
      } else {
        atom.notifications.addError("Elixir-docs startup error: \n" + e, {dismissable: true});
        lastError = e;
      }
    },
    exit: function(e) {
      console.error("CLOSED " + e + ", Last Error: " + lastError);
      return "";
    },
    stdout: function() {}
  });

  inp = iexProcess.process.stdin;
  iexProcess.process.stdout.on("data", handleIexResponse);
}

module.exports = ElixirDocs = {
  elixirDocsView: elixirDocsView,
  modalPanel: modalPanel,
  subscriptions: subscriptions,
  config: {
    elixirHome:{
      type: 'string',
      default: "",
      description: "Absolute path to elixir bin directory (required on Mac)"},
    erlangHome:{
      type: 'string',
      default: "",
      description: "Absolute path to erlang bin directory (required on Mac)"}
  },
  activate: function (state) {
    elixirDocsView = new ElixirDocsView(state.elixirDocsViewState);

    modalPanel = atom.workspace.addRightPanel({
      item: elixirDocsView.getElement(),
      visible: false
    });

    subscriptions = new CompositeDisposable();

    $('.elixir-docs-resize-handle').on('mousedown', resizeStarted);
    subscriptions.add(atom.commands.add('atom-workspace', {'elixir-docs:finddoc': findhelp}));
    subscriptions.add(atom.commands.add('atom-workspace', {'elixir-docs:toggle': toggle}));
    openTerminal();
  },
  deactivate: function() {
    iexProcess.kill(0);
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
