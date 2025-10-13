import "./style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as webix from "webix";
import { isAuthenticated, clearTokens } from "./api/http";
import { loginView } from "./ui/login";
import layout from "./ui/layout";


webix.attachEvent("app:logout", () => {
  clearTokens();
  loginView(layout);
});

webix.ready(() => {
  if (isAuthenticated()) {
    layout();
  } else {
    loginView(layout);
  }
});

webix.attachEvent("app:logout", () => {
  clearTokens();
  loginView(layout);
});