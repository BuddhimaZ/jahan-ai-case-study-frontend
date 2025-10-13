// import "./style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as webix from "webix";
import { isAuthenticated, clearTokens } from "./api/http";
import { loginView, LOGIN_ROOT_ID } from "./ui/login";
import layout, { APP_ROOT_ID } from "./ui/layout";


function clearUi() {
  const app = webix.$$(APP_ROOT_ID) as any;
  if (app && app.destructor) app.destructor();
  const login = webix.$$(LOGIN_ROOT_ID) as any;
  if (login && login.destructor) login.destructor();
}

webix.ready(() => {
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