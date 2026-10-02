# SkillSwap Lite

A small React app for sharing skills with your community. Post what you can teach, find something you want to learn, and manage swaps right in your browser.

## Features

- Create a swap with your name, a skill to teach, and a skill to learn.
- Browse all saved swaps and search by name or skill.
- Delete swaps; changes are saved in browser `localStorage` and remain after refresh.
- No account or backend required.

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Checks

```sh
npm run lint
npm run build
```

## Data storage

Swaps are stored under the `swaps` key in the current browser's `localStorage`. They are not synced between browsers or devices. Clearing browser storage removes saved swaps.
