tell application "Safari"
  set reloadedTabs to {}
  
  repeat with w in windows
    repeat with t in tabs of w
      set tabURL to URL of t
      reload t
      set end of reloadedTabs to tabURL
    end repeat
  end repeat
  
  return reloadedTabs
end tell 