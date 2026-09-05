const vscode              = require("vscode")
const {resolveTargetUris} = require("../lib/targetUris")

let outputChannel

//============================================================//
// Workspace-relative path, fallback to absolute when the file
// lives outside any open folder.
//============================================================//
const buildPath = (uri) => {
  const relative = vscode.workspace.asRelativePath(uri, false)
  return relative || uri.fsPath
}

//============================================================//
// Full path from the filesystem root. This is what makes a
// reference paste-able into a session opened on another
// project, where a workspace-relative path resolves to a file
// that does not exist there — or worse, to a different one.
//============================================================//
const buildAbsolutePath = (uri) => uri.fsPath

//============================================================//
// Convert a vscode.Selection into [startLine, endLine] (1-based)
// If selection ends at column 0 of the next line, snap back to
// the previous line (typical "triple-click" full-line select)
//============================================================//
const selectionLines = (selection) => {
  const start = selection.start.line + 1
  let end     = selection.end.line + 1
  if (selection.end.character === 0 && end > start) end -= 1
  return [start, end]
}

//============================================================//
// llm-cli style: @path#L10-L20 (Claude Code, Codex, Gemini CLI…)
//============================================================//
const formatLlmCli = (path, selection) => {
  const [start, end] = selectionLines(selection)
  if (start === end) return `@${path}#L${start}`
  return `@${path}#L${start}-L${end}`
}

//============================================================//
// Build the final string from all selections, joined by space.
// VSCode always exposes at least one selection (the cursor),
// so editor.selections is never empty.
//============================================================//
const buildReference = (editor, pathBuilder) => {
  const path = pathBuilder(editor.document.uri)
  return editor.selections.map((sel) => formatLlmCli(path, sel)).join(" ")
}

//============================================================//
// Copy to clipboard + discreet status bar feedback
//============================================================//
const copy = async (text, label) => {
  await vscode.env.clipboard.writeText(text)
  vscode.window.setStatusBarMessage(`📋 ${label} copied`, 2000)
  if (outputChannel) outputChannel.appendLine(`📋 ${label} → ${text.split("\n")[0]}${text.includes("\n") ? " …" : ""}`)
}

//============================================================//
// Guard: require an active text editor
//============================================================//
const withEditor = (handler) => async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showWarningMessage("No active editor")
    return
  }
  await handler(editor)
}

//============================================================//
// Shared handler for both file path commands: they differ only
// by how each URI is turned into a string.
//============================================================//
const copyFilePaths = (pathBuilder, label) => async (uri, uris) => {
  const targets = resolveTargetUris(uri, uris)
  if (targets.length === 0) {
    vscode.window.showWarningMessage("No file selected")
    return
  }
  const text = targets.map((u) => `@${pathBuilder(u)}`).join(" ")
  await copy(text, targets.length > 1 ? `${label}s (${targets.length})` : label)
}

const activate = (context, sharedOutputChannel) => {
  outputChannel = sharedOutputChannel

  context.subscriptions.push(
    vscode.commands.registerCommand("immosquare-vscode.copyRefLlmCli", withEditor(async (editor) => {
      await copy(buildReference(editor, buildPath), "llm-cli reference")
    })),
    vscode.commands.registerCommand("immosquare-vscode.copyRefLlmCliAbsolute", withEditor(async (editor) => {
      await copy(buildReference(editor, buildAbsolutePath), "llm-cli absolute reference")
    })),
    vscode.commands.registerCommand("immosquare-vscode.copyFilePath", copyFilePaths(buildPath, "File path")),
    vscode.commands.registerCommand("immosquare-vscode.copyFilePathAbsolute", copyFilePaths(buildAbsolutePath, "Absolute file path"))
  )
}

const deactivate = () => {
  outputChannel = null
}

module.exports = {
  activate,
  deactivate
}
