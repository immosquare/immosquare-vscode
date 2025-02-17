# immosquare-vscode

## ERB Snippets

| Prefix   | Description            |
| -------- | ---------------------- |
| `ct`     | content_tag            |
| `er`     | print ruby tag         |
| `pc`     | print comment tag      |
| `pe`     | print equal tag        |
| `if`     | ERB if / end           |
| `else`   | ERB else tag           |
| `end`    | ERB end tag            |
| `lt`     | ERB link tag           |
| `it`     | Image tag              |

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
