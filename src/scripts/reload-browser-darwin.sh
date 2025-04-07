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

# Map slugs to application names
slug_to_app() {
  case "$1" in
    "chrome") echo "Google Chrome" ;;
    "firefox") echo "firefox" ;;
    "safari") echo "Safari" ;;
    *) echo "$1" ;;
  esac
}

# Read browsers from arguments
browsers=()
for arg in "$@"; do
  browsers+=("$(slug_to_app "$arg")")
done

# Track if any browser was reloaded
reloaded=false

# Function to reload a browser
reload_browser() {
  local browser=$1
  case "$browser" in
    "Google Chrome")
      osascript "$(dirname "$0")/chrome.scpt"
      ;;
    "firefox")
      osascript -e 'tell application "System Events" to set frontApp to name of first application process whose frontmost is true' -e 'tell application "Firefox" to activate' -e 'tell application "System Events" to keystroke "r" using {command down}' -e 'delay 0.001' -e 'tell application frontApp to activate'
      ;;
    "Safari")
      osascript -e "tell application \"$browser\" to reload active tab of window 1"
      ;;
    *)
      echo "⚠️ Unsupported browser: $browser"
      ;;
  esac
}

# Try each browser
# Afficher les arguments pour le débogage
echo "🔍 Arguments reçus:"
for arg in "$@"; do
  echo "  - $arg"
done
echo "------------------------"

for browser in "${browsers[@]}"; do
  if is_running "$browser"; then
    if has_open_windows "$browser"; then
      echo "🔄 Attempting to reload $browser..."
      reload_browser "$browser"
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