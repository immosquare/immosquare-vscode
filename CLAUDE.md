# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VSCode extension for immosquare Rails development workflow. Provides automatic code cleaning via immosquare-cleaner gem, browser auto-reload for frontend files, ERB/Ruby snippets, Procfile syntax highlighting, and custom keybindings.

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

**Version bump workflow:** Update `package.json` version → Update `CHANGELOG.md` → `npx vsce package` → commit as "bump to X.X.X" → push → `npx vsce publish`

## Architecture

### Command Module Pattern
- Entry point: `src/immosquare-vscode.js` orchestrates command lifecycle
- Each command module exports `activate(context)` and `deactivate()` functions
- Commands: `CleanOnSave.js`, `reloadBrowserOnSave.js`
- Activation: `onStartupFinished` event (see `package.json`)

### CleanOnSave Implementation
- Listens to `onDidSaveTextDocument` for all file types
- Checks gem availability on activation via `bundle info immosquare-cleaner`
- Spawns shell with `-l` flag to load user profile (supports RVM/rbenv/asdf)
- Uses `FORCE_COLOR: "false"` env var to disable ANSI colors in output

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

## Snippets Reference

**ERB** (`src/snippets/erb.json`): `ct` (content_tag), `er` (ruby tag), `pc` (comment), `pe` (print equal), `if`, `else`, `end`, `lt` (link_tag), `it` (image_tag), `il` (immosquare logger), `partial`, `simple_form`

**Ruby** (`src/snippets/ruby.json`): `il` (immosquare logger)

## Keybindings

| Mac | Linux/Win | Action |
|-----|-----------|--------|
| `cmd+9` | `ctrl+9` | Outdent lines |
| `cmd+0` | `ctrl+0` | Indent lines |
| `shift+cmd+f` | `shift+ctrl+f` | Open search editor |
| `cmd+k` | `ctrl+k` | Clear output/terminal |
| `cmd+r` | `ctrl+r` | Expand selection |
| `shift+cmd+r` | `shift+ctrl+r` | Shrink selection |
| `cmd+3` | `ctrl+3` | Wrap selection in `"#{...}"` |

## Important Notes

- Requires `immosquare-cleaner` gem in project's Gemfile for code cleaning
- Browser reload is macOS-only (AppleScript dependency)
- Each command has its own output channel for debugging
