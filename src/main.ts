// Base CSS: load Webix styles and Font Awesome first, then our app overrides
import "webix/webix.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
// import "./style.css";
import * as webix from "webix";
import { isAuthenticated, clearTokens } from "./api/http";
import { loginView, LOGIN_ROOT_ID } from "./ui/login";
import layout, { APP_ROOT_ID } from "./ui/layout";
import { getSkin } from "./theme/skin";


function clearUi() {
  const app = webix.$$(APP_ROOT_ID) as any;
  if (app && app.destructor) app.destructor();
  const login = webix.$$(LOGIN_ROOT_ID) as any;
  if (login && login.destructor) login.destructor();
}

webix.ready(() => {
  // Ensure body has the current skin class on boot
  try {
    document.body.classList.remove("webix_dark", "webix_primary");
    document.body.classList.add(getSkin());
  } catch { }
  clearUi();
  if (isAuthenticated()) {
    layout();
  } else {
    loginView(() => {
      // Option A: rebuild layout cleanly
      clearUi();
      layout();
      // Option B (fallback): full reload
      // location.reload();
    });
  }
});

webix.attachEvent("app:logout", () => {
  clearTokens();
  clearUi();
  loginView(() => {
    clearUi();
    layout();
  });
});