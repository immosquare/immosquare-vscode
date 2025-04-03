#!/bin/bash

# Enable debug mode
set -x

# Function to check if a process is running
is_running() {
  local process=$1
  echo "🔍 Checking if $process is running..."
  pgrep -x "$process" > /dev/null
  local result=$?
  if [ $result -eq 0 ]; then
    echo "✅ $process is running"
  else
    echo "❌ $process is not running"
  fi
  return $result
}

# Function to check if a browser has any open windows
browser_has_windows() {
  local browser=$1
  echo "🔍 Checking if $browser has open windows..."
  osascript -e "tell application \"$browser\" to count windows" | grep -q '[1-9]'
  local result=$?
  if [ $result -eq 0 ]; then
    echo "✅ $browser has open windows"
  else
    echo "❌ $browser has no open windows"
  fi
  return $result
}

# Function to reload a browser
reload_browser() {
  local browser=$1
  echo "🔄 Attempting to reload $browser..."
  
  if browser_has_windows "$browser"; then
    osascript <<EOD
tell application "$browser"
  activate
  tell application "System Events" to keystroke "r" using {command down}
end tell
EOD
    echo "✅ $browser: tab reloaded"
    return 0
  else
    echo "⚠️ $browser is running but no windows are open"
    return 1
  fi
}

# List of browsers to try
browsers=(
  "Google Chrome"
  "Firefox"
)

echo "🚀 Starting browser reload script..."

# Try each browser
for browser in "${browsers[@]}"; do
  if is_running "$browser"; then
    if reload_browser "$browser"; then
      echo "✨ Successfully reloaded $browser"
      exit 0
    fi
  fi
done

# If no browser is open or no windows are open
echo "❌ No browser with open windows is currently available"
exit 1