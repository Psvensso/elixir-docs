var $ = require("jquery")
, modalPanel
, CompositeDisposable = require('atom').CompositeDisposable
, ElixirDocs
, ElixirDocsView = require('./elixir-docs-view')
, elixirDocsView
, subscriptions
, Process = require("atom").BufferedProcess
, autocomplete
, iexProcess
, fs = require('fs')
, marked = require('marked')
, inp
, path = require('path')
, projectPaths
, lastError = null
, isNoMixProject = false
, spawn = require('child_process').spawn;
var regs = {
  iex: /^iex\([1-9]{1,}\)>$/,
  start: /^Interactive Elixir/
}
function handleIexResponse(a){
  if(!a){
    return;
  }

  var hasTerminalStatement = a.trim().match(/^(iex\([1-9]{1,}\)>)/);
  var hasInteractiveText= a.indexOf("Interactive Elixir") > -1;
  var hasEshellText = a.indexOf("Eshell") > -1;

  if(!hasTerminalStatement && !hasInteractiveText && !hasEshellText){
    console.log(a);
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
};

function resizeTreeView(e) {
  $('.elixir-docs').width(window.innerWidth - e.clientX);
};

function resizeStopped() {
  $(document).off('mousemove', resizeTreeView);
  $(document).off('mouseup', resizeStopped);
};

function toggle() {
  !!iexProcess || openTerminal();
  if (modalPanel.isVisible()) {
    return modalPanel.hide();
  } else {
    return modalPanel.show();
  }
}

function findhelp() {
  !!iexProcess || openTerminal();
  modalPanel.show();
  updateText("");
  var txt = atom.workspace.getActiveTextEditor().getSelectedText();
  var term = "h("+ txt +")\n";
  inp.write(term);
}

function openTerminal(failSafer) {
  var p = atom.project.getPaths()[0];
  var args = !!failSafer ? [] : ["-S", "mix"];
  iexProcess = new Process({
    options: {
      cwd: path.normalize(p)
    },
    command: 'iex',
    args: args,
    stderr: function(e) {
      if(e.indexOf("Could not find a Mix.Project") > -1){
        isNoMixProject = true;
        openTerminal(true);
      } else {

      }
      return lastError = e;
    },
    exit: function(e) {
      console.error("CLOSED " + e + ", Last Error: " + lastError);
      return "";
    },
    stdout: function() {}
  });

  //atom.notifications.addInfo(editor = atom.workspace.getActivePaneItem().getSelectedText());
  inp = iexProcess.process.stdin;
  iexProcess.process.stdout.on("data", handleIexResponse);
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
