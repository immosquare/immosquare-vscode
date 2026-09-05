# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VSCode extension for immosquare Rails development workflow. Provides automatic code cleaning via immosquare-cleaner gem, browser auto-reload for frontend files, copy-as-LLM-reference commands, ERB/Ruby snippets, Procfile syntax highlighting, and custom keybindings.

## Development Commands

```bash
# Test extension: Press fn+f5 in VSCode to launch Extension Development Host

# Install dependencies
npm install
bundle install  # for testing CleanOnSave with immosquare-cleaner gem

# Build and publish
npx vsce package                    # creates .vsix file
npx vsce publish                    # publish to marketplace (requires publisher access)
```

**Version bump workflow:** see "Publishing a new release of immosquare-vscode to the VS Code Marketplace" in `README.md`. The commit of `package.json` and `CHANGELOG.md` has to land *before* packaging, or the archive carries the previous version.

### No screenshots in `README.md`
The README carries no image. A screenshot of a context menu goes stale the moment a command is added, renamed or removed, and nothing signals it — the one that shipped until 0.0.23 still showed three commands after a fourth existed. Menus are described in prose (which menu, which entries, what a multi-selection does) and choices between similar commands are drawn as a mermaid block, which is text: diffable, reviewable, and never out of date without the diff showing it.

If an image ever becomes unavoidable, `media/` is the VSCode convention and must stay out of `.vscodeignore` so the Marketplace serves it without depending on GitHub.

## Architecture

### Command Module Pattern
- Entry point: `src/immosquare-vscode.js` orchestrates command lifecycle and owns the shared output channel
- Each command module exports `activate(context, outputChannel)` and `deactivate()` functions
- Commands: `CleanOnSave.js`, `reloadBrowserOnSave.js`, `copyReference.js`, `openInBrowser.js`
- Shared helpers live in `src/lib/` — `targetUris.js` resolves the URIs a context-menu command targets, and is used by every command exposed on both the editor and the explorer menus
- Activation: `onStartupFinished` event (see `package.json`)

### Module system: CommonJS only (do NOT migrate to ESM)
- All source files use `require`/`module.exports`. This is **intentional and aligned with Microsoft's official guidance**.
- VSCode 1.94+ migrated its core to ESM but kept extensions on CommonJS — see [microsoft/vscode#130367](https://github.com/microsoft/vscode/issues/130367) and [#135450](https://github.com/microsoft/vscode/issues/135450). No ESM-for-extensions API is stable as of 2026-05.
- The global rule `~/.claude/rules/javascript.md` ("`import` only, never `require`") targets browser-bound code bundled via esbuild. It does **not** apply to this VSCode extension running in the Node host.
- When/if Microsoft officially ships ESM extension support, migration is trivial (add `"type": "module"`, convert 4 files). Until then, stay CommonJS.

### CleanOnSave Implementation
- Listens to `onDidSaveTextDocument`, but only for `file://` scheme documents inside a workspace
- Checks gem availability on activation via `bundle info immosquare-cleaner`
- Spawns shell with `-l` flag to load user profile (supports RVM/rbenv/asdf)
- Uses `FORCE_COLOR: "false"` env var to disable ANSI colors in output
- Target file path is passed via `IMS_CLEANER_FILE` env var (safe against quotes / `$` / backticks in paths)
- Concurrent saves of the same file are serialized via an in-flight `Map` to prevent overlapping writes

### Browser Reload Implementation
- macOS-only (uses AppleScript via `osascript`)
- Scripts in `src/scripts/` for each browser (chrome, firefox, safari)
- File extension matching via `.endsWith()` supports compound extensions (`.js.erb`)
- Configuration: `reloadableExtensions`, `browsers`, `urlPattern`

### Configuration
Access via `vscode.workspace.getConfiguration("immosquare-vscode")`:
- `reloadableExtensions`: array of extensions to watch (default: `.js`, `.js.erb`, `.html`, `.html.erb`)
- `browsers`: array of browsers to reload (default: `["chrome"]`)
- `urlPattern`: optional string to filter tabs by URL

### Copy Reference Implementation
- Four context-menu commands copy LLM-friendly references to the clipboard, in two families that differ only by how the URI is turned into a string:
  - `copyFilePath` → `@path/to/file.rb` and `copyRefLlmCli` → `@path/to/file.rb#L10-L20`, both workspace-relative
  - `copyFilePathAbsolute` → `@/Users/you/Sites/app/path/to/file.rb` and `copyRefLlmCliAbsolute` → the same with `#L10-L20`, both from the filesystem root
- The absolute pair exists because a workspace-relative reference resolves to nothing — or to a different file — once pasted into a session opened on another project
- All four are hidden from the command palette (`when: "false"`). All four appear in `editor/context`; the two plain-path ones also appear in `explorer/context` (file tree), all under group `9_immosquare`
- Multi-cursor selections are supported on the two `#Lxx-Lyy` commands, which produce one reference per cursor joined by a space. The plain-path commands ignore text selection; invoked from the explorer with several files or folders selected, they output one `@<path>` per item joined by a space (via `vscode.commands.registerCommand`'s `(uri, uris)` signature)
- "Triple-click full-line" selections (cursor lands at column 0 of the next line) are snapped back to the previous line to avoid spurious `Lx-L(x+1)` references

### Open In Browser Implementation
- `openInBrowser` hands each target URI to the OS, which opens it with the application registered for that file type — Chrome for `.html` on a standard setup
- macOS goes through `open <path>`; every other platform falls back to `vscode.env.openExternal`
- It resolves its targets with the same `src/lib/targetUris.js` helper as the copy commands, so the editor and explorer entry points cannot drift apart, and the explorer one accepts a multi-selection
- Naming no browser is deliberate: the command follows the OS association, so it keeps working when the default browser changes. The trade-off is that a file type mapped to an editor reopens there

## Snippets Reference

**ERB** (`src/snippets/erb.json`): `ct` (content_tag), `er` (ruby tag), `pc` (comment), `pe` (print), `if`, `else`, `elsif`, `end`, `each`, `yield`, `t` (i18n), `lt` (link_tag), `it` (image_tag), `il` (immosquare logger), `partial`, `simple_form`

**Ruby** (`src/snippets/ruby.json`): `il` (immosquare logger), `bc` (block comment with `##====##` separators)

### `configurationDefaults` for Ruby
`package.json` declares `[ruby]` defaults (`editor.tabCompletion: "onlySnippets"`, `editor.quickSuggestions.comments: "on"`). These let `bc` + Tab expand inside Ruby comment lines (where IntelliSense is normally muted). Don't remove without revisiting that UX.

## Keybindings

| Mac           | Linux/Win      | Action                       |
| ------------- | -------------- | ---------------------------- |
| `cmd+9`       | `ctrl+9`       | Outdent lines                |
| `cmd+0`       | `ctrl+0`       | Indent lines                 |
| `shift+cmd+f` | `shift+ctrl+f` | Open search editor           |
| `cmd+k`       | `ctrl+k`       | Clear output/terminal        |
| `cmd+r`       | `ctrl+r`       | Expand selection             |
| `shift+cmd+r` | `shift+ctrl+r` | Shrink selection             |
| `cmd+3`       | `ctrl+3`       | Wrap selection in `"#{...}"` |

## Important Notes

- Requires `immosquare-cleaner` gem in project's Gemfile for code cleaning
- Browser reload is macOS-only (AppleScript dependency)
- All four command modules (CleanOnSave, reloadBrowserOnSave, copyReference, openInBrowser) share a single `immosquare-vscode` output channel for debugging, owned by the entry point
