const vscode = require("vscode")
const cp     = require("child_process")
const path   = require("path")

let outputChannel
let config
let browsers

const getReloadableExtensions = () => {
  const allowedExtensions = config.get("reloadableExtensions")
  return allowedExtensions === false ? [] : allowedExtensions
}

const getFileExtension = (fileName) => {
  const allowedExtensions = getReloadableExtensions()
  return allowedExtensions.find((ext) => fileName.endsWith(ext)) || ""
}

//==============================================================================
// Check if the file requires browser reload
//==============================================================================
const isReloadableFile = (fileName) => {
  const allowedExtensions = getReloadableExtensions()
  return allowedExtensions.includes(getFileExtension(fileName))
}

//==============================================================================
// Reload browser
//==============================================================================
const reloadBrowser = (document) => {
  try {
    const extension  = getFileExtension(document.fileName)
    const scriptPath = path.join(__dirname, "../scripts/reload-browser-darwin.sh")

    outputChannel.appendLine(`🖥️ Browser reloading required for (${extension}) on ${browsers}`)
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
  config = vscode.workspace.getConfiguration("immosquare-vscode")

  //==============================================================================
  // Setup output channel
  //==============================================================================
  outputChannel = vscode.window.createOutputChannel("immosquare-vscode (reload")
  outputChannel.appendLine("Extension immosquare-vscode-reload activated")
  context.subscriptions.push(outputChannel)

  //==============================================================================
  // get browsers
  // allowed browsers: chrome, firefox, safari
  //==============================================================================
  const browsersAllowed = ["chrome", "firefox", "safari"]
  let browsersConfig    = config.get("browsers")
  browsersConfig        = typeof browsersConfig === "string" ? browsersConfig.split(",") : (browsersConfig || [])
  browsers              = browsersAllowed.filter((browser) => browsersConfig.includes(browser))
  

  //==============================================================================
  // Listen for save events
  //==============================================================================
  let saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (isReloadableFile(document.fileName)) {
      if (process.platform !== "darwin") {
        outputChannel.appendLine("⚠️ Automatic browser reload is only available on macOS")
        return
      }
      if (browsers.length === 0) {
        outputChannel.appendLine("⚠️ No browsers configured")
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
