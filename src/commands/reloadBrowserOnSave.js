const vscode = require("vscode")
const cp     = require("child_process")
const path   = require("path")

const browsersAllowed = ["chrome", "firefox", "safari"]
let outputChannel

const getConfig = () => vscode.workspace.getConfiguration("immosquare-vscode")

const getReloadableExtensions = () => {
  const exts = getConfig().get("reloadableExtensions")
  return Array.isArray(exts) ? exts : []
}

const getFileExtension = (fileName) => getReloadableExtensions().find((ext) => fileName.endsWith(ext)) || ""

const getActiveBrowsers = () => {
  const raw      = getConfig().get("browsers")
  const browsers = typeof raw === "string" ? raw.split(",").map((s) => s.trim()) : (Array.isArray(raw) ? raw : [])
  return browsersAllowed.filter((browser) => browsers.includes(browser))
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

const activate = (context, sharedOutputChannel) => {
  outputChannel = sharedOutputChannel
  outputChannel.appendLine("Extension immosquare-vscode-reload activated")

  //============================================================//
  // Listen for save events. Skip non-file documents (settings,
  // untitled, output channels, diff views…).
  //============================================================//
  const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.uri.scheme !== "file") return
    if (!getFileExtension(document.fileName)) return
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
  outputChannel = null
}

module.exports = {
  activate,
  deactivate
}
