const vscode    = require("vscode")
const { spawn } = require("child_process")

let workspacePath
let outputChannel
let gemInstalledPromise



//============================================================//
// Function to check if the gem immosquare-cleaner is installed on the workspace
//============================================================//
const checkGemInstallation = () => new Promise((resolve, reject) => {
  const shellCommand = `cd "${workspacePath}" && if bundle info immosquare-cleaner &>/dev/null; then echo "true"; else echo "false"; fi`
  
  //============================================================//
  // -l : Load the user's profile
  // -c : Execute the command
  //============================================================//
  const childProcess = spawn(process.env.SHELL || "/bin/bash", ["-l", "-c", shellCommand], {
    cwd: workspacePath,
    env: { ...process.env}
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
//============================================================//
const runCleaner = (filePath) => new Promise((resolve, reject) => {
  const filePathRelativeToWorkspace = filePath.replace(workspacePath, "")
  const shellCommand                = `cd "${workspacePath}" && bundle exec immosquare-cleaner "${filePath}"`
        
  outputChannel.appendLine(`🔄 Running cleaner: ${filePathRelativeToWorkspace}`)
  
  //============================================================//
  // -l : Load the user's profile
  // -c : Execute the command
  // FORCE_COLOR: "false" : Disable colors from output...(ANSI colors are not supported in vscode yet)
  //============================================================//
  const childProcess = spawn(process.env.SHELL || "/bin/bash", ["-l", "-c", shellCommand], {
    cwd: workspacePath,
    env: { ...process.env, FORCE_COLOR: "false" }
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
// Run the cleaner if the gem is installed
//============================================================//
const cleanFile = async (filePath) => {
  const installed = gemInstalledPromise ? await gemInstalledPromise : false
  if (!installed) {
    outputChannel.appendLine("⚠️ Please install the immosquare-cleaner gem to clean your code")
    return
  }
  try {
    await runCleaner(filePath)
  } catch (error) {
    outputChannel.appendLine(`❌ Error running cleaner: ${error}`)
  }
}

//============================================================//
// Extension activation
//============================================================//
const activate = (context) => {
  outputChannel = vscode.window.createOutputChannel("immosquare-vscode")
  outputChannel.appendLine("Extension immosquare-vscode activée")
  context.subscriptions.push(outputChannel)

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
    outputChannel.appendLine("❌ No workspace opened")
  }


  const disposable = vscode.commands.registerCommand("immosquare-vscode.CleanOnSave", async () => {
    const editor = vscode.window.activeTextEditor
    if (editor) {
      await cleanFile(editor.document.uri.fsPath)
    }
  })
  context.subscriptions.push(disposable)

  //============================================================//
  // Listen for save events
  //============================================================//
  const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    cleanFile(document.uri.fsPath)
  })

  //============================================================//
  // Add the save listener to the context subscriptions
  //============================================================//
  context.subscriptions.push(saveListener)
}

//============================================================//
// Extension deactivation
//============================================================//
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
