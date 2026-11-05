# Acer Atlas database upload

The validated publishing workflow watches:

`incoming/cultivar-database.json`

To publish a new database version:

1. Upload the complete JSON file to that exact path in the repository.
2. Commit the upload to the default branch.
3. GitHub Actions validates the JSON structure, record counts, required cultivar fields, and duplicate IDs.
4. Only after validation succeeds, the workflow copies the file to the live path `cultivar-database.json` and commits the published version.

The live database is not replaced when validation fails.

The workflow requires the repository Actions setting **Workflow permissions** to allow read and write access to repository contents.
