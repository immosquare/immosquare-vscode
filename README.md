# immosquare-vscode

This vscode extension provides several features to enhance your development workflow:

- [Run on Save Commands](#run-on-save-commands)
- [Code Snippets](#snippets)
- [Keybindings](#keybindings)
- [Settings](#settings)


## Run on Save Commands

This extension automatically runs two commands when a file is saved:

### 1. CleanOnSave Command
- **Purpose**: Runs the [immosquare-cleaner](https://github.com/immosquare/immosquare-cleaner) gem on the saved file to clean the code (Rubocop, Eslint, Prettier, etc.)
- **Requirement**: The `immosquare-cleaner` gem must be installed in your project

### 2. ReloadBrowserOnSave Command
- **Purpose**: Triggers browser reload for specific file types
- **Supported Extensions**: `.js`, `.js.erb`, `.html`, `.html.erb` (configurable via settings)
- **Behavior**: Automatically detects file extension and reloads the browser if required

### Output Channel
All extension activities are logged in the `immosquare-vscode` output channel, accessible through vscode's output panel (View > Output > immosquare-vscode).

## Settings

### Reloadable Extensions
- **Setting**: `immosquare-vscode.reloadableExtensions`
- **Type**: Array of strings
- **Default**: `[".js", ".js.erb", ".html", ".html.erb"]`
- **Description**: Configure which file extensions should trigger a browser reload when saved
- **Disable**: Set to `false` or an empty array `[]` to disable the browser reload feature
- **Example**: To add `.css` files to the reload list:

  ```json
  {
    "immosquare-vscode.reloadableExtensions": [
      ".js",
      ".js.erb",
      ".html",
      ".html.erb",
      ".css"
    ]
  }
  ```

- **Example**: To disable the feature:

  ```json
  {
    "immosquare-vscode.reloadableExtensions": false
  }
  ```

  or

  ```json
  {
    "immosquare-vscode.reloadableExtensions": []
  }
  ```


### Choose Browsers to reload
- **Setting**: `immosquare-vscode.browsers`
- **Type**: String or Array
- **Default**: `"chrome"`
- **Description**: Configure the default browser(s) for automatic reloading.
- **Options**: `"chrome"`, `"firefox"`, `"safari"`
- **Example**: To set Firefox as the default browser:

  ```json
  {
    "immosquare-vscode.browsers": "firefox"
  }
  ```

  Or to set multiple browsers:

  ```json
  {
    "immosquare-vscode.browsers": ["chrome", "firefox"]
  }
  ```

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
