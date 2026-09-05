const vscode              = require("vscode")
const cp                  = require("child_process")
const {resolveTargetUris} = require("../lib/targetUris")

let outputChannel

//============================================================//
// Hand the file to the OS, which opens it with the application
// registered for its type — Chrome for .html on a standard
// setup. Asking the OS rather than naming a browser is what
// keeps this working the day the default browser changes, and
// it is also why a file type mapped to an editor reopens there
// instead of in a browser.
//============================================================//
const openWithSystem = (uri) => new Promise((resolve) => {
  if (process.platform !== "darwin") {
    vscode.env.openExternal(uri).then(() => resolve(), () => resolve())
    return
  }
  cp.execFile("open", [uri.fsPath], (error) => {
    if (error && outputChannel) outputChannel.appendLine(`❌ open ${uri.fsPath} → ${error.message}`)
    resolve()
  })
})

const activate = (context, sharedOutputChannel) => {
  outputChannel = sharedOutputChannel

  context.subscriptions.push(
    vscode.commands.registerCommand("immosquare-vscode.openInBrowser", async (uri, uris) => {
      const targets = resolveTargetUris(uri, uris)
      if (targets.length === 0) {
        vscode.window.showWarningMessage("No file selected")
        return
      }
      for (const target of targets) {
        if (outputChannel) outputChannel.appendLine(`🌐 Opening ${target.fsPath}`)
        await openWithSystem(target)
      }
      vscode.window.setStatusBarMessage(targets.length > 1 ? `🌐 ${targets.length} files opened` : "🌐 Opened in browser", 2000)
    })
  )
}

const deactivate = () => {
  outputChannel = null
}

module.exports = {
  activate,
  deactivate
}
