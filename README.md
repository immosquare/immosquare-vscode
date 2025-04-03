# immosquare-vscode

This vscode extension provides several features to enhance your development workflow:

- [Run on Save Commands](#run-on-save-commands)
- [Code Snippets](#snippets)
- [Keybindings](#keybindings)


## Run on Save Commands

This extension automatically runs two commands when a file is saved:

### 1. CleanOnSave Command
- **Purpose**: Runs the [immosquare-cleaner](https://github.com/immosquare/immosquare-cleaner) gem on the saved file to clean the code (Rubocop, Eslint, Prettier, etc.)
- **Requirement**: The `immosquare-cleaner` gem must be installed in your project

### 2. ReloadBrowserOnSave Command
- **Purpose**: Triggers browser reload for specific file types
- **Supported Extensions**: `.js`, `.js.erb`, `.html`, `.html.erb`
- **Behavior**: Automatically detects file extension and reloads the browser if required

### Output Channel
All extension activities are logged in the `immosquare-vscode` output channel, accessible through vscode's output panel (View > Output > immosquare-vscode).

## Snippets

### ERB Snippets

| Prefix        | Description            |
| ------------- | ---------------------- |
| `ct`          | content_tag            |
| `er`          | print ruby tag         |
| `pc`          | print comment tag      |
| `pe`          | print equal tag        |
| `if`          | ERB if / end           |
| `else`        | ERB else tag           |
| `end`         | ERB end tag            |
| `lt`          | ERB link tag           |
| `it`          | Image tag              |
| `il`          | immosquare logger      |
| `partial`     | partial                |
| `simple_form` | simple_form            |


### Ruby Snippets

| Prefix   | Description            |
| -------- | ---------------------- |
| `il`     | immosquare logger      |

## Keybindings

| Keybinding (linux/mac)         | Command                                  | When                                  |
| ------------------------------ | ---------------------------------------- | ------------------------------------- |
| `ctrl+9` / `cmd+9`             | editor.action.outdentLines               | editorTextFocus && !editorReadonly    |
| `ctrl+0` / `cmd+0`             | editor.action.indentLines                | editorTextFocus && !editorReadonly    |
| `shift+ctrl+f` / `shift+cmd+f` | search.action.openNewEditor              |                                       |
| `ctrl+k` / `cmd+k`             | workbench.output.action.clearOutput      |                                       |
| `ctrl+k` / `cmd+k`             | workbench.action.terminal.clear          |                                       |
| `ctrl+r` / `cmd+r`             | editor.action.smartSelect.expand         | editorTextFocus                       |
| `shift+ctrl+r` / `shift+cmd+r` | editor.action.smartSelect.shrink         | editorTextFocus                       |
| `ctrl+3` / `cmd+3`             | editor.action.insertSnippet              | editorHasSelection                    |



## Testing
- To test the extension, tap fn+f5 to open a new window with the extension loaded.
