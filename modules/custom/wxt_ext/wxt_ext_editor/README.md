
# Drupal CKEditor 5 Custom Plugins

This project contains custom CKEditor 5 plugins built specifically for Drupal integration. Each plugin is located in its own subdirectory under `js/ckeditor5_plugins`, and will be individually built using Webpack into the `js/build` folder.

---

## 📁 Project Structure

```
js/
├── build/                      # Compiled plugin output
├── ckeditor5_plugins/
│   ├── wxt_alert/
│   │   └── src/                # Source files for Alert plugin
│   └── wxt_panel/
│       └── src/                # Source files for Panel plugin
```

---

## 🛠️ Prerequisites

Ensure Node.js (v16+) and npm are installed.

Then run:

```bash
npm install
```

---

## 🚀 Build All Plugins

To build all plugins (each subdirectory in `js/ckeditor5_plugins`):

```bash
npm run build
```

This runs Webpack in production mode and outputs one file per plugin into `js/build`, e.g.:

```
js/build/wxt_alert.js
js/build/wxt_panel.js
```

Each output is a UMD module accessible as `CKEditor5.wxt_alert`, `CKEditor5.wxt_panel`, etc.

---

## 👀 Watch for Changes (Development Mode)

To rebuild automatically as you edit:

```bash
npm run watch
```

This uses `webpack --watch` in development mode. It watches all `src/index.js` entry points per plugin directory.

---

## 📦 Plugin Usage in Drupal

1. Place the built plugin JS file in a location discoverable by Drupal (e.g., your module's `js/build/`).
2. In your CKEditor 5 build or Drupal plugin configuration, load the plugin:
    - Via `ckeditor5.plugin` library definition
    - Register the plugin using `CKEditor5.<plugin>.default`
3. Enable the plugin through the appropriate text format configuration or custom plugin loader.

---

## 🧩 Adding a New Plugin

1. Create a new folder under `js/ckeditor5_plugins/your_plugin_name/src/`.
2. Add an `index.js` file exporting your plugin.
3. Run `npm run build` to generate the compiled file in `js/build/your_plugin_name.js`.

---

## ⚙️ Webpack Details

- Dynamically builds each plugin based on subdirectories under `ckeditor5_plugins`.
- Outputs UMD modules for compatibility.
- Uses CKEditor DLL reference to reduce bundle size and speed up builds.
- Supports SVG and theme CSS loading via `raw-loader`, `style-loader`, and `postcss-loader`.

---

## 🔧 Troubleshooting

- Ensure `ckeditor5-dll.manifest.json` exists at `node_modules/ckeditor5/build/ckeditor5-dll.manifest.json`.
- If a plugin doesn't show in CKEditor, verify its export and ensure it's added to the editor config.

---
