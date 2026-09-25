/**
 * Sahayak AI Extension — Background Service Worker
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 29 & SECURITY.md Section 10
 * Phase: P08 — Browser Extension
 * 
 * Coordinates:
 * - Extension lifecycle & installation
 * - Chrome side panel opening behavior
 * - Tab updates across government portals
 */

// Enable Chrome Side Panel on action icon click
if (typeof chrome !== "undefined" && chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => {
      console.warn("[Sahayak ServiceWorker] Unable to set side panel behavior:", error);
    });
}

// Lifecycle: Installation event
if (typeof chrome !== "undefined" && chrome.runtime?.onInstalled) {
  chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
    if (details.reason === "install") {
      console.log("[Sahayak ServiceWorker] Extension installed successfully.");
    }
  });
}

// Tab navigation monitoring
if (typeof chrome !== "undefined" && chrome.tabs?.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      // Government portal host check
      const isGovDomain =
        tab.url.includes(".gov.in") ||
        tab.url.includes(".mahaonline.gov.in") ||
        tab.url.includes("localhost") ||
        tab.url.includes("127.0.0.1");

      if (isGovDomain && chrome.sidePanel?.setOptions) {
        chrome.sidePanel.setOptions({
          tabId,
          path: "sidepanel.html",
          enabled: true,
        }).catch(() => {
          // Ignore tab closure race conditions
        });
      }
    }
  });
}
