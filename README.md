# JSON to Markdown Table

This GitHub Action converts a given JSON object to a Markdown table.

## Example usage

### Reusable workflow

```yaml
name: Create Markdown table from JSON

on:
  workflow_call:
    inputs:
      json-object:
        description: 'The JSON object to convert to a Markdown table'
        required: true
        type: string

jobs:
  create-issue:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Create table
        id: create-table
        uses: parkerbxyz/json-to-markdown-table@v1
        with:
          json: ${{ inputs.json-object }}
          align-pipes: 'false'

      - name: Create issue
        id: create-issue
        uses: JasonEtco/create-an-issue@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MARKDOWN_TABLE: ${{ steps.create-table.outputs.table }}
        with:
          filename: .github/ISSUE_TEMPLATE/markdown-table.md
          update_existing: false

      - name: Print issue link to summary
        env:
          ISSUE_URL: ${{ steps.create-issue.outputs.url }}
        run: |
          if [[ "$ISSUE_URL" ]]; then
            echo "Created $ISSUE_URL." >>"$GITHUB_STEP_SUMMARY"
          else
            echo "Issue already exists." >>"$GITHUB_STEP_SUMMARY"
          fi
```

## Inputs

### `json`

**Required** The JSON object to convert to a Markdown table.

### `align-pipes`

Set to 'false' if you do not want the table delimiters aligned.

## Outputs

### `table`

The Markdown table that was generated from the JSON object.
