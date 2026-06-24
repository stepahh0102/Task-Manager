export const isElectron = () => {
  return window.navigator.userAgent.toLowerCase().includes('electron');
};

export const getAppName = (): string => {
  if (isElectron() && window.electronAPI) {
    return window.electronAPI.getAppName();
  }
  return 'Task Manager';
};