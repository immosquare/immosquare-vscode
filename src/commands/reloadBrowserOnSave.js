const vscode               = require("vscode")
const { getOutputChannel } = require("../utils/outputChannel")

//==============================================================================
// List of file extensions that require browser reload
//==============================================================================
const RELOADABLE_EXTENSIONS = [".js", ".js.erb", ".html", ".html.erb"]

//==============================================================================
// Extract file extension
//==============================================================================
const getFileExtension = (fileName) => fileName.match(/\.[^.]+$/)?.[0] || ""

//==============================================================================
// Check if the file requires browser reload
//==============================================================================
const isReloadableFile = (fileName) => {
  const extension = getFileExtension(fileName)
  return RELOADABLE_EXTENSIONS.includes(extension)
}

const activate = (context) => {
  const outputChannel = getOutputChannel()
  context.subscriptions.push(outputChannel)

  //==============================================================================
  // Listen for save events
  //==============================================================================
  let saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (isReloadableFile(document.fileName)) {
      const extension = getFileExtension(document.fileName)
      outputChannel.appendLine(`🖥️ Browser reloading required for (${extension})`)
    }
  })

  context.subscriptions.push(saveListener)
}

const deactivate = () => {
}

module.exports = {
  activate,
  deactivate
} 