const vscode = require("vscode")
const cp     = require("child_process")
const path   = require("path")



let outputChannel
const RELOADABLE_EXTENSIONS = [".js", ".js.erb", ".html", ".html.erb"]
const getFileExtension      = (fileName) => fileName.match(/\.[^.]+$/)?.[0] || ""

//==============================================================================
// Check if the file requires browser reload
//==============================================================================
const isReloadableFile = (fileName) => {
  const extension = getFileExtension(fileName)
  return RELOADABLE_EXTENSIONS.includes(extension)
}

//==============================================================================
// Reload browser
//==============================================================================
const reloadBrowser = (document) => {
  try {
    const extension  = getFileExtension(document.fileName)
    const scriptPath = path.join(__dirname, "../scripts/reload-browser-darwin.sh")

    outputChannel.appendLine(`🖥️ Browser reloading required for (${extension})`)
    const result = cp.execSync(scriptPath, { encoding: "utf8" })
    
    const messages = result.toString().trim().split("\n")
    messages.forEach((message) => {
      outputChannel.appendLine(message)
    })
  } catch(error) {
    outputChannel.appendLine("❌ Error details:")
    if (error.stdout) {
      outputChannel.appendLine(`stdout: ${error.stdout.trim()}`)
    }
    if (error.stderr) {
      outputChannel.appendLine(`stderr: ${error.stderr.trim()}`)
    }
    outputChannel.appendLine(`Error message: ${error.message}`)
  }
}

const activate = (context) => {
  outputChannel = vscode.window.createOutputChannel("immosquare-vscode (reload")
  outputChannel.appendLine("Extension immosquare-vscode-reload activated")
  
  context.subscriptions.push(outputChannel)

  //==============================================================================
  // Listen for save events
  //==============================================================================
  let saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (isReloadableFile(document.fileName)) {
      if (process.platform !== "darwin") {
        outputChannel.appendLine("⚠️ Automatic browser reload is only available on macOS")
        return
      }
      reloadBrowser(document)
    }
  })

  context.subscriptions.push(saveListener)
}

const deactivate = () => {
  if (outputChannel) {
    outputChannel.dispose()
    outputChannel = null
  }
}

module.exports = {
  activate,
  deactivate
} 
