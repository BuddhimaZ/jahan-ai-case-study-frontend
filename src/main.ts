import "./style.css";
import * as webix from "webix";
import { isAuthenticated, clearTokens } from "./api/http";
import { loginView } from "./ui/login";
import { preferencesView } from "./ui/preferences";

function mount(view: webix.ui.layout) {
  const node = document.getElementById("app");
  if (!node) throw new Error("#app not found");
  node.innerHTML = ""; // clear
  node.style.minHeight = "100vh";
  node.style.display = "block";
  view.config.container = node;
}

function showLogin() {
  const view = loginView(showPreferences);
  mount(view);
}

function showPreferences() {
  const view = preferencesView();
  mount(view);
}

webix.attachEvent("app:logout", () => {
  clearTokens();
  showLogin();
});

if (isAuthenticated()) {
  showPreferences();
} else {
  showLogin();
}
