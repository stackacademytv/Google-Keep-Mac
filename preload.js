
// Modules
const {SpellCheckHandler, ContextMenuListener, ContextMenuBuilder} = require('electron-spellchecker')

// Enable spellchecker
window.spellCheckHandler = new SpellCheckHandler()
window.spellCheckHandler.attachToInput()
window.spellCheckHandler.switchLanguage('en-US')

// Enable context menus
let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler)
let contextMenuListener = new ContextMenuListener((info) => {
  contextMenuBuilder.showPopupMenu(info)
})
