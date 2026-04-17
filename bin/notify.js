#!/usr/bin/env node
const { parseArgs } = require('node:util');
const { send, listBundledIcons } = require('../src/notify');

const HELP = `Usage:
  notify [options] [message...]

Examples:
  notify "Build finished"
  notify -t "Deploy" -m "Succeeded" -s Default
  notify -t "Done" -i check -s Default
  notify -t "Review?" -m "Open the PR?" -a Open -a Dismiss -w

Options:
  -t, --title <text>    Toast title (default: "Notification")
  -m, --message <text>  Toast body (or pass positionals: notify "hello world")
  -i, --icon <name|path> Bundled icon name (see --list-icons) or absolute/relative path
                         Pass 'false' to disable icon. Defaults to 'bell'.
  -s, --sound <value>   Sound: true | false | Default | IM | Mail | Reminder | SMS
  -a, --action <label>  Add an action button (repeatable; implies --wait)
  -w, --wait            Wait for user interaction and print the response value
      --list-icons      List bundled icon names and exit
  -h, --help            Show this help
`;

function parse() {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        title:        { type: 'string',  short: 't' },
        message:      { type: 'string',  short: 'm' },
        icon:         { type: 'string',  short: 'i' },
        sound:        { type: 'string',  short: 's' },
        action:       { type: 'string',  short: 'a', multiple: true },
        wait:         { type: 'boolean', short: 'w' },
        'list-icons': { type: 'boolean' },
        help:         { type: 'boolean', short: 'h' },
      },
    });
  } catch (err) {
    console.error(`Error parsing arguments: ${err.message}\n`);
    console.error(HELP);
    process.exit(2);
  }
}

const { values, positionals } = parse();

if (values.help) {
  console.log(HELP);
  process.exit(0);
}

if (values['list-icons']) {
  const icons = listBundledIcons();
  if (icons.length === 0) {
    console.log('(no bundled icons found in assets/icons/)');
  } else {
    console.log(icons.join('\n'));
  }
  process.exit(0);
}

const message = values.message ?? positionals.join(' ');
if (!message && !values.title) {
  console.error('Error: provide a message (positional or --message) or a --title\n');
  console.error(HELP);
  process.exit(1);
}

send({
  title: values.title,
  message,
  icon: values.icon,
  sound: values.sound,
  actions: values.action,
  wait: values.wait,
})
  .then(({ response, metadata }) => {
    const waited = Boolean(values.wait) || (Array.isArray(values.action) && values.action.length > 0);
    if (!waited) return;
    const value = metadata?.activationValue ?? response ?? '';
    if (value) process.stdout.write(`${value}\n`);
  })
  .catch((err) => {
    console.error(`Failed to send notification: ${err.message}`);
    process.exit(1);
  });
