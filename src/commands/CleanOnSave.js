const vscode    = require("vscode")
const path      = require("path")
const { spawn } = require("child_process")

let workspacePath
let outputChannel
let gemInstalledPromise
const inFlight = new Map()



//============================================================//
// Function to check if the gem immosquare-cleaner is installed on the workspace
//============================================================//
const checkGemInstallation = () => new Promise((resolve, reject) => {
  const shellCommand = "if bundle info immosquare-cleaner >/dev/null 2>&1; then echo \"true\"; else echo \"false\"; fi"

  //============================================================//
  // -l : Load the user's profile (RVM / rbenv / asdf)
  // -c : Execute the command
  //============================================================//
  const childProcess = spawn(process.env.SHELL || "/bin/bash", ["-l", "-c", shellCommand], {
    cwd: workspacePath,
    env: { ...process.env }
  })

  let stdout = ""

  childProcess.stdout.on("data", (data) => {
    stdout += data.toString()
  })

  childProcess.on("close", (code) => {
    if (code !== 0) {
      reject(`Process ended with code ${code}`)
    } else {
      resolve(stdout.trim() === "true")
    }
  })
})

//============================================================//
// Function to run the immosquare-cleaner command
// The target file is passed via env var so a path containing
// quotes, $ or backticks cannot break the shell command.
//============================================================//
const runCleaner = (filePath) => new Promise((resolve, reject) => {
  const filePathRelativeToWorkspace = path.relative(workspacePath, filePath)
  const shellCommand                = "bundle exec immosquare-cleaner \"$IMS_CLEANER_FILE\""

  outputChannel.appendLine(`🔄 Running cleaner: ${filePathRelativeToWorkspace}`)

  //============================================================//
  // -l : Load the user's profile
  // -c : Execute the command
  // FORCE_COLOR: "false" : Disable colors from output (ANSI not supported in vscode)
  //============================================================//
  const childProcess = spawn(process.env.SHELL || "/bin/bash", ["-l", "-c", shellCommand], {
    cwd: workspacePath,
    env: { ...process.env, FORCE_COLOR: "false", IMS_CLEANER_FILE: filePath }
  })

  childProcess.stdout.on("data", (data) => {
    outputChannel.append(data.toString())
  })

  childProcess.stderr.on("data", (data) => {
    outputChannel.append(data.toString())
  })

  childProcess.on("close", (code) => {
    if (code !== 0) {
      outputChannel.appendLine(`❌ Cleaning ended with errors (code ${code})`)
      reject(code)
    } else {
      outputChannel.appendLine("✅ Cleaning completed successfully")
      resolve()
    }
  })
})

//============================================================//
// Run the cleaner if the gem is installed.
// Saves on the same file are serialized to avoid concurrent
// writes when the user spams ⌘+S.
//============================================================//
const cleanFile = (filePath, { silent = false } = {}) => {
  const previous = inFlight.get(filePath) || Promise.resolve()
  const run = previous.then(async () => {
    const installed = gemInstalledPromise ? await gemInstalledPromise : false
    if (!installed) {
      if (!silent) outputChannel.appendLine("⚠️ Please install the immosquare-cleaner gem to clean your code")
      return
    }
    try {
      await runCleaner(filePath)
    } catch (error) {
      outputChannel.appendLine(`❌ Error running cleaner: ${error}`)
    }
  })
  inFlight.set(filePath, run)
  run.finally(() => {
    if (inFlight.get(filePath) === run) inFlight.delete(filePath)
  })
  return run
}

//============================================================//
// Extension activation
//============================================================//
const activate = (context, sharedOutputChannel) => {
  outputChannel = sharedOutputChannel
  outputChannel.appendLine("Extension immosquare-vscode activée")

  //============================================================//
  // Check if the gem is installed in the workspace
  //============================================================//
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath
    outputChannel.appendLine(`📁 Workspace folder: ${workspacePath}`)
    outputChannel.appendLine("🔄 Checking gem: in progress...")

    gemInstalledPromise = checkGemInstallation()
      .then((installed) => {
        if (installed) {
          outputChannel.appendLine("✅ immosquare-cleaner gem is installed")
        } else {
          outputChannel.appendLine("⚠️ immosquare-cleaner gem is not installed")
        }
        return installed
      })
      .catch((error) => {
        outputChannel.appendLine(`❌ Error checking gem: ${error}`)
        return false
      })
  } else {
    outputChannel.appendLine("ℹ️ No workspace opened — CleanOnSave disabled")
  }


  const disposable = vscode.commands.registerCommand("immosquare-vscode.CleanOnSave", async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return
    if (editor.document.uri.scheme !== "file") return
    if (!workspacePath) {
      outputChannel.appendLine("⚠️ No workspace folder open")
      return
    }
    await cleanFile(editor.document.uri.fsPath)
  })
  context.subscriptions.push(disposable)

  //============================================================//
  // Listen for save events. Skip non-file documents (settings,
  // untitled, output channels, diff views…) and skip silently
  // when no workspace is open.
  //============================================================//
  const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.uri.scheme !== "file") return
    if (!workspacePath) return
    cleanFile(document.uri.fsPath, { silent: true })
  })

  context.subscriptions.push(saveListener)
}

//============================================================//
// Extension deactivation
//============================================================//
const deactivate = () => {
  outputChannel = null
}

module.exports = {
  activate,
  deactivate
}
