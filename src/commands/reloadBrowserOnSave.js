const vscode = require("vscode")
const cp     = require("child_process")
const path   = require("path")

const browsersAllowed = ["chrome", "firefox", "safari"]
let outputChannel

const getConfig = () => vscode.workspace.getConfiguration("immosquare-vscode")

const getReloadableExtensions = () => {
  const exts = getConfig().get("reloadableExtensions")
  return exts === false ? [] : exts
}

const getFileExtension = (fileName) => getReloadableExtensions().find((ext) => fileName.endsWith(ext)) || ""

const getActiveBrowsers = () => {
  let browsersConfig = getConfig().get("browsers")
  browsersConfig     = typeof browsersConfig === "string" ? browsersConfig.split(",") : (browsersConfig || [])
  return browsersAllowed.filter((browser) => browsersConfig.includes(browser))
}

//============================================================//
// Reload browser
//============================================================//
const reloadBrowser = (document, browsers) => {
  const extension  = getFileExtension(document.fileName)
  const scriptsDir = path.join(__dirname, "../scripts")
  const urlPattern = getConfig().get("urlPattern") || ""

  outputChannel.appendLine(`🖥️ Browser reloading required for (${extension}) on ${browsers}`)

  browsers.forEach((browser) => {
    outputChannel.appendLine(`🔄 Reloading ${browser}...`)
    cp.execFile("osascript", [path.join(scriptsDir, `${browser}.scpt`), urlPattern], (error, stdout, stderr) => {
      if (error) {
        outputChannel.appendLine(`❌ ${browser} error: ${error.message}`)
        if (stdout) outputChannel.appendLine(`stdout: ${stdout.trim()}`)
        if (stderr) outputChannel.appendLine(`stderr: ${stderr.trim()}`)
        return
      }
      const result = stdout.toString().trim()
      if (result) {
        outputChannel.appendLine(`✅ ${browser}: ${result}`)
      }
    })
  })
}

const activate = (context) => {
  //============================================================//
  // Setup output channel
  //============================================================//
  outputChannel = vscode.window.createOutputChannel("immosquare-vscode (reload)")
  outputChannel.appendLine("Extension immosquare-vscode-reload activated")
  context.subscriptions.push(outputChannel)

  //============================================================//
  // Listen for save events
  //============================================================//
  const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (!getFileExtension(document.fileName)) {
      return
    }
    if (process.platform !== "darwin") {
      outputChannel.appendLine("⚠️ Automatic browser reload is only available on macOS")
      return
    }
    const browsers = getActiveBrowsers()
    if (browsers.length === 0) {
      outputChannel.appendLine("⚠️ No browsers configured")
      return
    }
    reloadBrowser(document, browsers)
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
