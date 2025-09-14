const { execSync } = require("child_process")
const vscode       = require("vscode")

//==============================================================================
// Launch the rake task to generate the raw.txt file
//==============================================================================
const generateRawFile = () => {
  try {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd()
    execSync("bundle exec rake credentials:export", {
      cwd:   workspaceRoot,
      stdio: "ignore"
    })
  } catch (e) {
    console.error(`Erreur lors de l'export des credentials : ${e.message}`)
  }
}

//==============================================================================
// OnActive + Watche on .yml.enc files from credentials folder
//==============================================================================
const activate = (context) => {
  generateRawFile()
  const workspaceRoot   = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd()
  const credentialsPath = require("path").join(workspaceRoot, "config", "credentials")
  const watcher         = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(credentialsPath, "*.yml.enc")
  )
  watcher.onDidChange(generateRawFile)
  watcher.onDidCreate(generateRawFile)
  watcher.onDidDelete(generateRawFile)
  context.subscriptions.push(watcher)
}

const deactivate = () => {}

module.exports = { activate, deactivate } 
