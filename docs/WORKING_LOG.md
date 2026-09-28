# Working Log

This file records notable development work, decisions, validation and follow-up items by date. Add new entries above older entries.

## 2026-09-28

### Model library

- Audited the Rotating System GLB against its component manifest.
- Corrected exact object-name mappings and expanded the manifest to cover all eight pistons and all eight connecting rods.
- Created the Engine Overview component manifest with one entry for each of its 10 top-level mesh nodes.
- Added Engine Overview to the model catalogue with a camera preset based on its scene bounds.
- Diagnosed model-loading failures caused by catalogue filenames that did not match files on disk.

### Model performance analysis

- Inspected GLB headers, accessors, mesh counts and geometry payloads without loading complete models into application memory.
- Confirmed that Engine Overview uses Draco compression and contains no embedded textures.
- Compared Engine Overview with Rotating System and identified decoded geometry, vertex count and triangle count as the primary causes of slower loading and rendering.
- Recommended further mesh decimation, particularly for `CylinderHeadAssembly` and `EngineBlock`, before applying final geometry compression.

### Viewer and interaction

- Changed the selected-object highlight to dark blue (`#0b3d91`) across GLB, STL and schematic rendering.
- Set the 3D viewport height to 700 px and added independent scrolling for long component lists.
- Added collapsible system groups with component counts and accessible expanded-state attributes.
- Moved the model selector into the left sidebar and renamed the section to `MODEL & COMPONENTS`.
- Moved Reset, Isolate, Explode and X-ray controls into a compact toolbar above the 3D canvas.
- Added click-on-empty-space deselection in normal and fullscreen modes.
- Separated the selected component from the isolated component so deselection no longer disables isolation.
- Added a Play/Pause control for automatic camera rotation.
- Configured clicks on either the model or empty canvas space to stop automatic rotation.
- Set automatic rotation speed to `2`.

### Validation

- Validated component JSON syntax, required fields, unique IDs and one-to-one GLB node mappings.
- Ran `git diff --check` after source edits to detect malformed patches and whitespace errors.
- A full frontend build was not run during the session because Node/npm was unavailable in the active shell and the Docker daemon was not running.

### Follow-up

- Run `docker compose up --build` when Docker Desktop is available.
- Test toolbar spacing and automatic rotation on desktop, tablet, mobile and fullscreen layouts.
- Visually verify all component selection, isolate, hide, explode and X-ray interactions.
- Continue reducing Engine Overview geometry toward roughly 1–1.5 million total triangles for smoother web rendering.

