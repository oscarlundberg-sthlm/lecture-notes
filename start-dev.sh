currentPath=$PWD;

echo "🤖 Starting Next.js in a new terminal window...";

osascript <<EOF
tell application "Terminal"
    do script "cd $currentPath && yarn workspace next-js dev"
end tell
EOF

echo "🤖 Starting Electron...";

yarn workspace lecture-notes-electron start;

# echo "🤖 Starting Next.js in a new terminal window...";

# osascript <<EOF
# tell application "Terminal"
#     do script "cd $currentPath/next-js && yarn dev"
# end tell
# EOF

# echo "🤖 Starting Electron...";

# cd $currentPath/electron && yarn start;

# echo "This doesn't work yet.";
# echo "For Next.js development, run it in the browser.";
# echo "Later incorporate Electron, in the build process of the app.";