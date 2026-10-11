# Working Log

This file records notable development work, decisions, validation and follow-up items by date. Add new entries above older entries.

## 2026-10-11

### Model information

- Replaced the generic `Explore the engine` empty state with model-specific information in the right-side panel.
- Added an `overview` field to every model entry in `models/catalog.json` so introductory content can be maintained without changing the frontend.
- Added a fallback introduction and a prompt directing learners to select a component for more detail.
- Updated backend catalogue validation to accept and validate the optional model overview.

### Component learning content

- Replaced the legacy `function`, `location` and `maintenance` fields with `overview`, `mainFunctions` and `workingPrinciple` learning content.
- Populated the 10 Engine Overview components from `marine_engine_components.md`.
- Populated Turbocharger, Lubricating Oil System, Cylinder Head, Generator and Common Bed, and the first 15 Rotating System components from `Marine_Engine_Components_Supplement.md`.
- Added the remaining Rotating System content for Idle gear, Main bearing and Piston 1-8 from `Marine_Engine_Components_Supplement (1).md`.
- Completed the schema migration for all 60 components across the six model manifests.
- Preserved component IDs, GLB object mappings, colors, positions and explode offsets while replacing the learning-content fields.

### Component information interface

- Updated the Component Details panel and fullscreen information popup to render Overview, Main Functions and Working Principle.
- Displayed Main Functions as a readable bullet list.
- Added distinct colors and icons for the three learning-section headings.
- Kept compatibility with the legacy content fields during the migration.
- Refactored `ComponentDetails.tsx` into smaller `ModelOverview`, `DetailSection` and `MainFunctions` components for easier maintenance.
- Reformatted `style.css` from compressed single-line rules into readable multi-line CSS.
- Documented that the right-side panel width is controlled by the final column in the main grid's `grid-template-columns` declaration.

### Validation

- Validated all six component manifests as JSON.
- Confirmed that all 60 components contain non-empty `overview`, `mainFunctions` and `workingPrinciple` fields.
- Confirmed that the migrated manifests no longer contain `function`, `location` or `maintenance` fields.
- Checked the updated files for replacement-character encoding errors.
- Ran the backend unit test successfully after the catalogue and metadata changes.
- Frontend build validation was not available because npm was not installed in the active Windows or WSL environment.

### Backend simplification

- Removed PostgreSQL, SQLite, SQLAlchemy and Psycopg from the application runtime.
- Changed the backend to load the catalogue and all component learning content exclusively from JSON under `models/`.
- Removed the database service, dependency and persistent PostgreSQL volume from Docker Compose.
- Made the health endpoint stateless and updated architecture, technology-stack and deployment documentation accordingly.
- Validated the simplified Compose configuration and reran the backend unit test successfully.

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

