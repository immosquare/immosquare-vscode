on run argv
  set urlPattern to ""
  if (count of argv) > 0 then
    set urlPattern to item 1 of argv
  end if
  
  tell application "System Events"
    if not (exists process "Google Chrome") then
      return "⚠️ browser is not running !"
    end if
    set currentApp to name of first application process whose frontmost is true
  end tell
  
  tell application "Google Chrome"
    set reloadedTabs to {}
    
    repeat with w in windows
      repeat with t in tabs of w
        set tabURL to URL of t
        if urlPattern is "" or tabURL contains urlPattern then
          set end of reloadedTabs to tabURL
          reload t
        end if
      end repeat
    end repeat
  end tell
  
  tell application currentApp to activate
  return reloadedTabs
end run