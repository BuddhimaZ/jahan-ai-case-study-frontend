import "./style.css";
import * as webix from "webix";
import { isAuthenticated, clearTokens } from "./api/http";
import { loginView } from "./ui/login";
import { preferencesView } from "./ui/preferences";

let currentRoot: any = null;

function getAppNode(): HTMLElement {
  const node = document.getElementById("app");
  if (!node) throw new Error("#app not found");
  node.innerHTML = ""; // clear previous markup
  node.style.minHeight = "100vh";
  node.style.display = "block";
  return node;
}

function showLogin() {
  const node = getAppNode();
  if (currentRoot && currentRoot.destructor) currentRoot.destructor();
  currentRoot = loginView(showPreferences, node);
}

function showPreferences() {
  const node = getAppNode();
  if (currentRoot && currentRoot.destructor) currentRoot.destructor();
  currentRoot = preferencesView(node);
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
