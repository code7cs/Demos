# Demos monorepo layout

This repository is **[code7cs/Demos](https://github.com/code7cs/Demos)** on GitHub.

## Expected local path

Clone or align your machine so the **git root** is:

```text
~/code/Demos/
├── angular-demos/     ← Angular app (memory game, undoable counter)
├── mock-app/
├── leetcode/
└── ...
```

Do **not** use a nested `Demos/AngularProject2026/` folder — that name is obsolete.

## Fix a nested `AngularProject2026` checkout

If you still have `~/code/Demos/AngularProject2026/` as the git root:

```bash
chmod +x align-repo-folder.sh
./align-repo-folder.sh
```

Or manually:

```bash
cd ~/code
mv Demos/AngularProject2026 Demos-repo-tmp
rmdir Demos 2>/dev/null || true
mv Demos-repo-tmp Demos
```

Re-open Cursor/VS Code on `~/code/Demos`.

## Run the Angular app

```bash
cd ~/code/Demos/angular-demos
npm install
npm start
```

Or from monorepo root: `npm start`
