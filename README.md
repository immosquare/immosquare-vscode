# immosquare-vscode

VSCode extension to enhance your development workflow with:
- [Code Cleaning](#code-cleaning)
- [Browser Reloading](#browser-reloading)
- [ERB snippets](#erb-snippets)
- [Ruby snippets](#ruby-snippets)
- [Custom keyboard shortcuts](#keyboard-shortcuts)

## Code Cleaning

The extension automatically runs the [immosquare-cleaner](https://github.com/immosquare/immosquare-cleaner) gem on saved files to clean your code (Rubocop, Eslint, Prettier, etc.).

**Requirement**: The `immosquare-cleaner` gem must be installed in your project.

## Browser Reloading

The extension automatically reloads browsers when you save specific files.

### Configuration

```json
{
  "immosquare-vscode.reloadableExtensions": [".js", ".js.erb", ".html", ".html.erb"],
  "immosquare-vscode.browsers": ["chrome", "firefox", "safari"],
  "immosquare-vscode.urlPattern": "immosquare.me"
}
```

- `reloadableExtensions`: File extensions to watch (default: [".js", ".js.erb", ".html", ".html.erb"])
- `browsers`: Browsers to reload (default: ["chrome"])
- `urlPattern` (optional): Pattern to filter URLs to reload, only reloads tabs containing this pattern

## ERB Snippets
| Prefix        | Description       |
| ------------- | ----------------- |
| `ct`          | content_tag       |
| `er`          | print ruby tag    |
| `pc`          | print comment tag |
| `pe`          | print equal tag   |
| `if`          | ERB if / end      |
| `else`        | ERB else tag      |
| `end`         | ERB end tag       |
| `lt`          | ERB link tag      |
| `it`          | Image tag         |
| `il`          | immosquare logger |
| `partial`     | partial           |
| `simple_form` | simple_form       |

## Ruby Snippets
| Prefix   | Description       |
| -------- | ----------------- |
| `il`     | immosquare logger |

## Keyboard Shortcuts

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
