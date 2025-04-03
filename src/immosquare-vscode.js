const CleanOnSave              = require("./commands/CleanOnSave")
const reloadBrowserOnSave      = require("./commands/reloadBrowserOnSave")
const { disposeOutputChannel } = require("./utils/outputChannel")

module.exports = {
  activate: (context) => {
    reloadBrowserOnSave.activate(context)
    CleanOnSave.activate(context)
    
  },
  deactivate: () => {
    reloadBrowserOnSave.deactivate()
    CleanOnSave.deactivate()
    disposeOutputChannel()
  }
} 
