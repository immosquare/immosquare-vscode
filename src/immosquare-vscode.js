const CleanOnSave            = require("./commands/CleanOnSave")
const reloadBrowserOnSave    = require("./commands/reloadBrowserOnSave")
const GenerateRawCredentials = require("./commands/GenerateRawCredentials")

module.exports = {
  activate: (context) => {
    reloadBrowserOnSave.activate(context)
    CleanOnSave.activate(context)
    GenerateRawCredentials.activate(context)
  },
  deactivate: () => {
    reloadBrowserOnSave.deactivate()
    CleanOnSave.deactivate()
    GenerateRawCredentials.deactivate()
  }
} 
