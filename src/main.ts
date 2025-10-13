import "./style.css";
import * as webix from "webix";
import { isAuthenticated, clearTokens } from "./api/http";
import { loginView } from "./ui/login";
import { preferencesView } from "./ui/preferences";


webix.attachEvent("app:logout", () => {
  clearTokens();
  loginView(preferencesView);
});

webix.ready(() => {
  if (isAuthenticated()) {
    preferencesView();
  } else {
    loginView(preferencesView);
  }
});
