currentPath=$PWD;

echo "🤖 Starting Next.js in a new terminal window...";

osascript <<EOF
tell application "Terminal"
    do script "cd $currentPath && yarn workspace next-js dev"
end tell
EOF

echo "🤖 Starting Electron...";

yarn workspace lecture-notes-electron start;