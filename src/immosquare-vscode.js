const vscode             = require("vscode")
const CleanOnSave         = require("./commands/CleanOnSave")
const reloadBrowserOnSave = require("./commands/reloadBrowserOnSave")

let outputChannel

module.exports = {
  activate: (context) => {
    outputChannel = vscode.window.createOutputChannel("immosquare-vscode")
    context.subscriptions.push(outputChannel)
    reloadBrowserOnSave.activate(context, outputChannel)
    CleanOnSave.activate(context, outputChannel)
  },
  deactivate: () => {
    CleanOnSave.deactivate()
    reloadBrowserOnSave.deactivate()
    outputChannel = null
  }
}
