tell application "System Events"
  set frontApp to name of first application process whose frontmost is true
  tell application "Firefox" to activate
  keystroke "r" using {command down}
  delay 0.001
  tell application frontApp to activate
  return "Page rechargée"
end tell 