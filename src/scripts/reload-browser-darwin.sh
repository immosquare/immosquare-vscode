#!/bin/bash

# Function to check if a process is running
is_running() {
  pgrep -x "$1" > /dev/null
}

# Function to check if a browser has any open windows
has_open_windows() {
  local browser=$1
  osascript -e "tell application \"$browser\" to count windows" | grep -q '[1-9]'
}

# List of browsers to try
browsers=(
  "Google Chrome"
  "firefox"
)

# Track if any browser was reloaded
reloaded=false

# Try each browser
for browser in "${browsers[@]}"; do
  if is_running "$browser"; then
    if has_open_windows "$browser"; then
      osascript -e "tell application \"$browser\" to reload active tab of window 1"
      echo "✅ $browser: tab reloaded"
    else
      echo "⚠️ $browser is running but no windows are open"
    fi
    reloaded=true
  fi
done

# If no browser was reloaded
if [ "$reloaded" = false ]; then
  echo "❌ No browser with open windows is currently available"
fi

exit 0