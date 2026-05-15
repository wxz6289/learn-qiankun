const store = {
  count: 0,
  input: '',
};

export function loadPersisted(appBridge, appName) {
  const fromMain = appBridge?.getAppState?.(appName);
  if (fromMain) {
    store.count = fromMain.count ?? store.count;
    store.input = fromMain.input ?? store.input;
  }
  return { count: store.count, input: store.input };
}

export function savePersisted(partial, appBridge, appName) {
  if (partial.count !== undefined) store.count = partial.count;
  if (partial.input !== undefined) store.input = partial.input;
  appBridge?.saveAppState?.(appName, { count: store.count, input: store.input });
}
