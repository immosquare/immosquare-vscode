const vscode = require("vscode")

let outputChannel = null

const getOutputChannel = () => {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("immosquare-vscode")
    outputChannel.appendLine("Extension immosquare-vscode activated")
    outputChannel.show(true)
  }
  return outputChannel
}

const disposeOutputChannel = () => {
  if (outputChannel) {
    outputChannel.dispose()
    outputChannel = null
  }
}

module.exports = {
  getOutputChannel,
  disposeOutputChannel
} 
