# @zhaochy/notify

Send Windows toast notifications from the CLI. Wraps [`node-notifier`](https://github.com/mikaelbr/node-notifier) with a small, scriptable interface.

## Install

```bash
git clone git@github.com:zhaochy1990/notify.git
cd notify
npm install

# Optional: expose `notify` globally
npm link
```

Requires Node.js 18+.

## CLI usage

```bash
# Simplest — positional message
notify "Build finished"

# With title + sound
notify -t "Deploy" -m "Succeeded" -s Default

# With action buttons (waits for a click, prints the label)
notify -t "Review?" -m "Open the PR?" -a Open -a Dismiss -w
```

### Options

| Flag                       | Description                                                                  |
| -------------------------- | ---------------------------------------------------------------------------- |
| `-t, --title <text>`       | Toast title (default: `"Notification"`)                                      |
| `-m, --message <text>`     | Toast body (or pass positional args)                                         |
| `-i, --icon <name\|path>`  | Bundled icon name (see below) or path to a PNG. Pass `false` to disable.     |
| `-s, --sound <value>`      | `true`, `false`, or a Windows sound name (`Default`, `IM`, `Mail`, …)        |
| `-a, --action <label>`     | Add an action button (repeatable; implies `--wait`)                          |
| `-w, --wait`               | Wait for user interaction; print the response value to stdout                |
| `--list-icons`             | Print bundled icon names                                                     |
| `-h, --help`               | Show help                                                                    |

### Bundled icons

Ten ready-to-use icons live in `assets/icons/`, pulled from Microsoft's [Fluent UI Emoji](https://github.com/microsoft/fluentui-emoji) 3D set (MIT). Pass the name with `-i`:

| Name        | When to use                          |
| ----------- | ------------------------------------ |
| `bell`      | Default / generic notification       |
| `check`     | Success                              |
| `error`     | Failure                              |
| `warning`   | Caution                              |
| `info`      | Informational                        |
| `hourglass` | In progress / waiting                |
| `rocket`    | Release / deploy                     |
| `fire`      | Urgent / on fire                     |
| `package`   | Build / artifact                     |
| `gear`      | Config / task                        |

```bash
notify -t "Deploy" -m "Succeeded" -i check -s Default
notify -t "Broken" -m "Staging is down"   -i fire  -s Default
notify --list-icons
```

Windows toast image constraints: PNG, < 1024×1024 px, < 200 KB, absolute path. Relative paths are resolved against the current working directory.

## Programmatic usage

```js
const { send } = require('@zhaochy/notify');

await send({
  title: 'Build',
  message: 'Green across the board',
  sound: 'Default',
  actions: ['Open', 'Dismiss'],
  wait: true,
});
```

`send()` returns a `Promise<{ response, metadata }>`. When the user clicks a button, `metadata.activationValue` is the button label.

## License

MIT
