# Topic Master — PYQ Screenshot Importer (Chrome Extension)

A Chrome extension that sequentially captures and imports official GateOverflow question screenshots for the **Topic Master** practice workspace.

---

## 🚀 How to Install

1. Open Google Chrome.
2. Navigate to `chrome://extensions`.
3. Toggle on **Developer mode** in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the `extension/` folder in this project:
   ```
   e:\projects\TOPIC MASTER\extension
   ```
6. The **Topic Master — PYQ Screenshot Importer** icon 📷 will appear in your Chrome toolbar.

---

## 🌟 How It Works

### 1. Subject-Only Batch Capture
* Open the extension popup from the Chrome toolbar.
* Select one, multiple, or all subjects (e.g. *Engineering Mathematics (320 Qs)*, *Algorithms (240 Qs)*).
* Click **Begin Import**.
* The extension will open a background tab and sequentially capture each question screenshot into local storage.

### 2. Cloudflare & Security Challenge Safe Pause
* If a Cloudflare Turnstile or CAPTCHA check is encountered, the extension **automatically pauses** and prompts:
  > **Security verification detected**
  > Complete the verification in Chrome, then click Resume Import.
* Once completed, click **[ Resume Import ]** to continue smoothly without losing progress.

### 3. Persistent Resume & Recovery
* If the browser closes, network drops, or you click **Stop Import**, progress is preserved.
* Already-captured questions are automatically skipped when resuming.

### 4. Direct Single-Question Capture ("Capture Specific Page")
* Inside the Topic Master Practice Workspace, clicking **[ Capture Specific Page ]** on any question will instantly trigger the extension to capture that exact question URL and display it immediately in your practice viewport.
