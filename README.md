# elixir-docs package
Finds source code docs for a namespaces and outputs the parsed markdown docs in a tool panel.

1. Hightlight you namespace you want the docs for
2. Run command (or add keymap to) 'elixir-docs:finddoc'

If you have a mix file in your project root folder the plugin loads up iex -S mix e.g. includes all your project dependencies when searching for docs. Otherwise falls back to just showing docs for Elixirs base libs.

![Screenshot1](https://gyazo.com/fd996b70a340522b07f3c267a2ba4c8d.png)
Keymaps
```javascript
'atom-workspace':
  'ctrl-alt-o': 'elixir-docs:toggle'
  'ctrl-i': 'elixir-docs:finddoc'
```

Configuration:

For mac you need to set `elixirPath` and `erlangHome` under settings.

Config example:

```
"elixir-docs":
    elixirPath: "/usr/local/bin"
    erlangHome: "/usr/local/bin"
```

#### Known issues
* Does not resolve binding. E.g. you cant select a bound
  value and ask for docs. It needs the entire namespace.
* Recompilation
    - The project needs to recompile to show latest docs
      this is not taken care of by this plugin.
* on todo list: Smarter namespace selection from "carret" etc.

