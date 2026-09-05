const vscode = require("vscode")

//============================================================//
// Resolve the URIs a context-menu command targets.
// - From explorer/context: VSCode passes (clickedUri, selectedUris[])
// — return the multi-selection when present, otherwise the click.
// - From editor/context or command palette: fall back to the
// active text editor's document URI.
// Shared by every command exposed on both menus, so the two
// entry points can never drift apart.
//============================================================//
const resolveTargetUris = (uri, uris) => {
  if (Array.isArray(uris) && uris.length > 0) return uris
  if (uri && uri.fsPath) return [uri]
  const editor = vscode.window.activeTextEditor
  if (editor) return [editor.document.uri]
  return []
}

module.exports = {resolveTargetUris}
