const vscode = require("vscode")

let outputChannel

//============================================================//
// Build the workspace-relative path, fallback to absolute
//============================================================//
const buildPath = (uri) => {
  const relative = vscode.workspace.asRelativePath(uri, false)
  return relative || uri.fsPath
}

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
const formatLlmCli = (relPath, selection) => {
  const [start, end] = selectionLines(selection)
  if (start === end) return `@${relPath}#L${start}`
  return `@${relPath}#L${start}-L${end}`
}

//============================================================//
// Build the final string from all selections, joined by space.
// VSCode always exposes at least one selection (the cursor),
// so editor.selections is never empty.
//============================================================//
const buildReference = (editor, formatter) => {
  const relPath = buildPath(editor.document.uri)
  return editor.selections.map((sel) => formatter(relPath, sel)).join(" ")
}

//============================================================//
// Map VSCode languageId to Markdown fence language hint.
// Returns "" when no sensible Markdown lang exists.
//============================================================//
const MARKDOWN_LANG_BY_ID = {
  javascriptreact: "jsx",
  typescriptreact: "tsx",
  shellscript:     "bash",
  jsonc:           "json",
  plaintext:       ""
}

const markdownLang = (languageId) => {
  if (!languageId) return ""
  if (languageId in MARKDOWN_LANG_BY_ID) return MARKDOWN_LANG_BY_ID[languageId]
  return languageId
}

//============================================================//
// Build "@path#L10-L20\n```lang\n<code>\n```"
//============================================================//
const buildReferenceWithCode = (editor) => {
  const relPath = buildPath(editor.document.uri)
  const lang    = markdownLang(editor.document.languageId)
  const blocks  = editor.selections.map((sel) => {
    const reference = formatLlmCli(relPath, sel)
    const code      = sel.isEmpty ? "" : editor.document.getText(sel).replace(/\n+$/, "")
    if (!code) return reference
    return `${reference}\n\`\`\`${lang}\n${code}\n\`\`\``
  })
  return blocks.join("\n\n")
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
// Resolve the URIs targeted by copyFilePath.
// - From explorer/context: VSCode passes (clickedUri, selectedUris[])
// — return the multi-selection when present, otherwise the click.
// - From editor/context or command palette: fall back to the
// active text editor's document URI.
//============================================================//
const resolveFilePathUris = (uri, uris) => {
  if (Array.isArray(uris) && uris.length > 0) return uris
  if (uri && uri.fsPath) return [uri]
  const editor = vscode.window.activeTextEditor
  if (editor) return [editor.document.uri]
  return []
}

const activate = (context, sharedOutputChannel) => {
  outputChannel = sharedOutputChannel

  context.subscriptions.push(
    vscode.commands.registerCommand("immosquare-vscode.copyRefLlmCli", withEditor(async (editor) => {
      await copy(buildReference(editor, formatLlmCli), "llm-cli reference")
    })),
    vscode.commands.registerCommand("immosquare-vscode.copyRefWithCode", withEditor(async (editor) => {
      await copy(buildReferenceWithCode(editor), "Reference + code")
    })),
    vscode.commands.registerCommand("immosquare-vscode.copyFilePath", async (uri, uris) => {
      const targets = resolveFilePathUris(uri, uris)
      if (targets.length === 0) {
        vscode.window.showWarningMessage("No file selected")
        return
      }
      const text = targets.map((u) => `@${buildPath(u)}`).join(" ")
      await copy(text, targets.length > 1 ? `File paths (${targets.length})` : "File path")
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
