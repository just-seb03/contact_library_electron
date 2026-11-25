export { APP_DISPLAY_NAME, APP_ID } from './appInfo'
export {
  applySystemPreferences,
  getSystemPreferences,
  loadSystemPreferences,
  type SystemPreferences,
} from './preferences'
export {
  createTray,
  destroyTray,
  isTrayActive,
  notifyRunningInBackground,
} from './trayManager'
export {
  createMainWindow,
  getMainWindow,
  markQuitting,
  navigateMainWindow,
  registerWindowController,
  showMainWindow,
} from './windowManager'
