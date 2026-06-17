export const DATA_CHANGED_EVENT = "mr-tracker:data-changed";

const channel = new BroadcastChannel('mr-tracker-data-channel');

export const notifyDataChanged = () => {
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
  channel.postMessage('data-changed');
};

channel.onmessage = (event) => {
  if (event.data === 'data-changed') {
    window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
  }
};

export const onDataChange = (callback) => {
  window.addEventListener(DATA_CHANGED_EVENT, callback);
};

export const offDataChange = (callback) => {
  window.removeEventListener(DATA_CHANGED_EVENT, callback);
};
