const path = require('path');
const fs = require('fs');
const notifier = require('node-notifier');

const ICON_DIR = path.join(__dirname, '..', 'assets', 'icons');
const DEFAULT_ICON_NAME = 'bell';

function isBundledName(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    !value.includes('/') &&
    !value.includes('\\') &&
    !value.includes('.') &&
    !path.isAbsolute(value)
  );
}

function resolveIcon(icon) {
  if (icon === false || icon === 'false') return undefined;

  if (!icon) {
    const fallback = path.join(ICON_DIR, `${DEFAULT_ICON_NAME}.png`);
    return fs.existsSync(fallback) ? fallback : undefined;
  }

  if (isBundledName(icon)) {
    const named = path.join(ICON_DIR, `${icon}.png`);
    if (fs.existsSync(named)) return named;
  }

  return path.resolve(icon);
}

function listBundledIcons() {
  if (!fs.existsSync(ICON_DIR)) return [];
  return fs
    .readdirSync(ICON_DIR)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => f.replace(/\.png$/i, ''))
    .sort();
}

function send({ title, message, icon, sound, actions, wait, appID } = {}) {
  const payload = {
    title: title || 'Notification',
    message: message || '',
    appID: appID || 'notify-cli',
  };

  const resolvedIcon = resolveIcon(icon);
  if (resolvedIcon) payload.icon = resolvedIcon;

  if (sound === true || sound === 'true') payload.sound = true;
  else if (sound && typeof sound === 'string' && sound !== 'false') payload.sound = sound;
  else payload.sound = false;

  const hasActions = Array.isArray(actions) && actions.length > 0;
  if (hasActions) payload.actions = actions;

  payload.wait = Boolean(wait) || hasActions;

  return new Promise((resolve, reject) => {
    notifier.notify(payload, (err, response, metadata) => {
      if (err) return reject(err);
      resolve({ response, metadata });
    });
  });
}

module.exports = { send, resolveIcon, listBundledIcons, ICON_DIR };
