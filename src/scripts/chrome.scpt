tell application "Google Chrome"
  repeat with w in windows
    repeat with t in tabs of w
      reload t
    end repeat
  end repeat
end tell