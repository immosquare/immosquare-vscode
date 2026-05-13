const vscode              = require("vscode")
const CleanOnSave         = require("./commands/CleanOnSave")
const reloadBrowserOnSave = require("./commands/reloadBrowserOnSave")
const copyReference       = require("./commands/copyReference")

let outputChannel

module.exports = {
  activate: (context) => {
    outputChannel = vscode.window.createOutputChannel("immosquare-vscode")
    context.subscriptions.push(outputChannel)
    reloadBrowserOnSave.activate(context, outputChannel)
    CleanOnSave.activate(context, outputChannel)
    copyReference.activate(context, outputChannel)
  },
  deactivate: () => {
    CleanOnSave.deactivate()
    reloadBrowserOnSave.deactivate()
    copyReference.deactivate()
    outputChannel = null
  }
}
