# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VSCode extension for immosquare, designed to enhance the development workflow for Rails applications with ERB templates. The extension provides:
- Automatic code cleaning via the immosquare-cleaner gem
- Browser auto-reload for frontend files
- ERB and Ruby snippets
- Procfile syntax highlighting
- Custom keyboard shortcuts

## Development Commands

### Testing the Extension
```bash
# Press fn+f5 in VSCode to open a new window with the extension loaded
# Or use the VSCode debugger with the "Extension" configuration
```

### Publishing New Versions
```bash
# 1. Update version in package.json
# 2. Update CHANGELOG.md with changes
# 3. Build the extension (creates .vsix file)
npx vsce package

# 4. Commit changes
git add .
git commit -m "bump to X.X.X"
git push

# 5. Publish to VSCode marketplace (requires publisher access)
npx vsce publish
```

### Dependencies
```bash
# Install Node dependencies
npm install

# Install Ruby gem (for testing CleanOnSave functionality)
bundle install
```

## Architecture

### Extension Structure

The extension follows a modular command-based architecture:

```
src/
├── immosquare-vscode.js          # Main entry point - activates/deactivates commands
├── commands/
│   ├── CleanOnSave.js            # Runs immosquare-cleaner on file save
│   └── reloadBrowserOnSave.js    # Reloads browsers when frontend files are saved
├── scripts/
│   ├── chrome.scpt               # AppleScript for Chrome reload
│   ├── firefox.scpt              # AppleScript for Firefox reload
│   └── safari.scpt               # AppleScript for Safari reload
├── snippets/
│   ├── erb.json                  # ERB snippets (ct, er, if, etc.)
│   └── ruby.json                 # Ruby snippets
└── languages/
    ├── erb.json                  # ERB language configuration
    ├── procfile.json             # Procfile language configuration
    └── procfile.tmLanguage.json  # Procfile TextMate grammar for syntax highlighting
```

### Key Architectural Patterns

**1. Command Registration Pattern**
- Each command is a separate module with `activate()` and `deactivate()` functions
- Main entry point (`immosquare-vscode.js`) orchestrates command lifecycle
- Commands register VSCode event listeners (e.g., `onDidSaveTextDocument`)

**2. Shell Integration for CleanOnSave**
- Uses user's default shell (`process.env.SHELL || "/bin/bash"`) with `-l` flag to load profile
- Spawns child process for `bundle exec immosquare-cleaner <file>`
- Checks gem availability on activation using `bundle info immosquare-cleaner`
- Streams stdout/stderr to VSCode output channel

**3. Browser Reload via AppleScript**
- macOS-only feature using `osascript` to execute AppleScript files
- Supports URL pattern filtering to reload only specific tabs
- Configuration-driven browser selection (chrome, firefox, safari)

**4. Configuration Management**
- Settings defined in `package.json` under `contributes.configuration`
- Accessed via `vscode.workspace.getConfiguration("immosquare-vscode")`
- Key settings: `reloadableExtensions`, `browsers`, `urlPattern`

### Critical Implementation Details

**CleanOnSave Command:**
- Triggers automatically on every `onDidSaveTextDocument` event (not file-type filtered)
- Checks gem installation status asynchronously on activation
- Only runs cleaner if gem is installed (shows warning otherwise)
- Uses workspace-relative paths for output messages
- Disables ANSI colors with `FORCE_COLOR: "false"` environment variable

**Browser Reload Command:**
- Only activates on macOS (`process.platform === "darwin"`)
- File extension matching uses `.endsWith()` to support compound extensions (`.js.erb`, `.html.erb`)
- Configured browsers must be in allowed list: `["chrome", "firefox", "safari"]`
- URL pattern is optional - reloads all tabs if not specified

## Extension Context

This extension is tailored for immosquare's Rails development workflow:
- ERB templates are the primary view layer
- `immosquare-cleaner` gem handles code formatting (Rubocop, ESLint, Prettier)
- Rapid frontend iteration requires browser auto-reload
- Snippets optimize common ERB patterns (content_tag, partials, simple_form, etc.)

## Important Notes

- The extension requires `immosquare-cleaner` gem to be in the project's Gemfile
- Browser reload only works on macOS due to AppleScript dependency
- Output channels are separate for each command (helps with debugging)
- Shell commands use user's login shell to ensure proper RVM/rbenv/asdf environment loading
