const CleanOnSave         = require("./commands/CleanOnSave")
const reloadBrowserOnSave = require("./commands/reloadBrowserOnSave")

module.exports = {
  activate: (context) => {
    reloadBrowserOnSave.activate(context)
    CleanOnSave.activate(context)
    
  },
  deactivate: () => {
    reloadBrowserOnSave.deactivate()
    CleanOnSave.deactivate()
  }
} 
