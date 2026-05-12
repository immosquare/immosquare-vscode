## [0.0.20] - 2026-05-11
- Add Ruby `bc` snippet that inserts a `##====##` block comment with the cursor focused on the comment text
- Enable `tabCompletion=onlySnippets` and `quickSuggestions` in comments for Ruby files so `bc`+Tab inserts directly
- Skip save listeners on non-file documents (settings, untitled, output channels, diff views) to stop spurious cleaner runs
- Serialize concurrent saves on the same file to prevent overlapping cleaner writes
- Pass the cleaner target path via `IMS_CLEANER_FILE` env var instead of shell interpolation (safe against quotes, `$`, backticks)
- Share a single `immosquare-vscode` output channel between CleanOnSave and browser reload
- Declare ERB via explicit file extensions instead of an empty configuration file
- Trim comma-separated `browsers` config values and require an actual array for `reloadableExtensions`
- Skip the cleaner warning silently when no workspace folder is open
- Fix snippet description typos ("egual" → "equal", "Loggger" → "Logger")
- Tighten packaging: drop `.DS_Store`, `.ruby-lsp/`, `*.vsix`, and dev docs from the published `.vsix`

## [0.0.19] - 2026-04-28
- Switch browser reload to async execFile (no more save freeze, no shell-injection via urlPattern)
- Read reload config (extensions, browsers, urlPattern) on each save so changes apply without reloading the window
- Fix race condition where the first saves after activation could wrongly report immosquare-cleaner as missing
- Extract cleanFile helper shared by the manual command and the save listener

## [0.0.18] - 2025-10-29
- Add Procfile language support

## [0.0.17] - 2025-10-09
- Update gems + Remove GenerateRawCredentials

## [0.0.16] - 2025-07-07
- Add GenerateRawCredentials command

## [0.0.15] - 2025-04-08
- Use default shell user for CleanOnSave instead of /bin/bash

## [0.0.14] - 2025-04-08
- improve relaodBehevior

## [0.0.13] - 2025-04-08
- Add urlPattern setting to filter tabs to reload

## [0.0.12] - 2025-04-03
- Improve reloadBrowserOnSave script

## [0.0.11] - 2025-04-03
- remove show(true) option for outputChannel

## [0.0.10] - 2025-04-03
- Add reloadableExtensions setting
- Reload browsers on background

## [0.0.9] - 2025-04-02
- Improve reloadBrowserOnSave script

## [0.0.8] - 2025-04-02
 - Using '*' activation is usually a bad idea as it impacts performance, using 'onStartupFinished' is a better approach.

## [0.0.7] - 2025-04-02
- Add CleanOnSave command (immosquare-cleaner vscode extension)
- Add reloadBrowserOnSave command

## [0.0.6] - 2025-03-20
- Improve erb snippets

## [0.0.5] - 2025-03-20
- Fix : Do not display the logger in HTML
- Add node_modules to .vscodeignore

## [0.0.4] - 2025-03-20
- Add new snippet for Logger

## [0.0.3] - 2025-03-06
- Add elsif snippet

## [0.0.2] - 2025-02-21
- Changed icon path to the root directory

## [0.0.1] - 2025-02-17
- Initial release
