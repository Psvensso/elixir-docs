# elixir-docs package
* Highlight a namespace
* Open docs panel 'elixir-docs:toggle'
* Hightlight you namespace you want the docs for
* Run command (or add keymap to) 'elixir-docs:finddoc'



### ToDo
* Need to add support for project files, currently only finds Elixir base libs
* Add support for more "select" options, like in the autocomplete plugin etc.
* Smarter namespace selection from "carret" etc.
* Run more commands
* Make sure it runs on Mac -x (totally not tested)
* Error handling (errors are shown in the panel right now)


Outputs the markdown styled docs on the docs panel  

Keymaps
```javascript
'atom-workspace':
  'ctrl-alt-o': 'elixir-docs:toggle'
```


![Screenshot1](http://s16.postimg.org/4c14p7d8l/Capture.png)
![Screenshot2](http://s15.postimg.org/veaq97b9n/Capture.png)
