const notifier = require('node-notifier');

const VALID_SOUNDS = new Set([
  'Default', 'IM', 'Mail', 'Reminder', 'SMS',
  'Looping.Alarm', 'Looping.Alarm2', 'Looping.Alarm3', 'Looping.Alarm4',
  'Looping.Alarm5', 'Looping.Alarm6', 'Looping.Alarm7', 'Looping.Alarm8',
  'Looping.Alarm9', 'Looping.Alarm10',
  'Looping.Call', 'Looping.Call2', 'Looping.Call3', 'Looping.Call4',
  'Looping.Call5', 'Looping.Call6', 'Looping.Call7', 'Looping.Call8',
  'Looping.Call9', 'Looping.Call10',
]);

function send({ title, message, icon, sound, actions, wait, appID } = {}) {
  const payload = {
    title: title || 'Notification',
    message: message || '',
    appID: appID || 'notify-cli',
  };

  if (icon) payload.icon = icon;

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

module.exports = { send, VALID_SOUNDS };
