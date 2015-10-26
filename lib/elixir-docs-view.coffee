{$, View} = require 'atom-space-pen-views'

module.exports =
class ElixirDocsView
  constructor: (serializedState) ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('elixir-docs')
    @element.classList.add('elixir-docs-resizer')
    @element.classList.add('tool-panel')

    # scroller message element
    scrollhandler = document.createElement('div')
    scrollhandler.classList.add('elixir-docs-scroller')
    @element.appendChild(scrollhandler)

    # scroller message element
    @body = document.createElement('div')
    @body.classList.add('body')
    @body.classList.add('focusable-panel')
    scrollhandler.appendChild(@body)

    # Create message element
    scroller = document.createElement('div')
    scroller.classList.add('elixir-docs-resize-handle')
    @element.appendChild(scroller)


  # Returns an object that can be retrieved when package is activated
  serialize: ->
    hasFocus: @hasFocus()
    attached: @panel?
    width: @width()

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element
