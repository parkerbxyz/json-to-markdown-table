// @ts-check
import core from '@actions/core'
import { gfmTableToMarkdown } from 'mdast-util-gfm-table'
import { toMarkdown } from 'mdast-util-to-markdown'

// We export the `run` function for testing
// Call `run()` directly if this file is the entry point

// If this file is being run directly
if (import.meta.url.endsWith(process.argv[1])) {
  const json = JSON.parse(core.getInput('json'))
  const alignPipes = core.getInput('align-pipes') !== 'false'

  core.setOutput(
    'table',
    await run(core, json, alignPipes).catch((error) => {
      core.setFailed(error)
    })
  )
}

/**
 * @param {import("@actions/core")} core
 * @param {Object} json
 * @param {boolean} [alignPipes]
 */
export async function run(core, json, alignPipes) {
  function createTableCell(value) {
    return {
      type: 'tableCell',
      children: [{ type: 'text', value: String(value) }]
    }
  }

  function createTableRow(cells) {
    return {
      type: 'tableRow',
      children: cells.map(createTableCell)
    }
  }

  function createTable(headers, rows) {
    return {
      type: 'table',
      align: headers.map(() => 'left'), // Align all columns left
      children: [createTableRow(headers), ...rows.map(createTableRow)]
    }
  }

  // Convert JSON to mdast (Markdown Abstract Syntax Tree)
  const headers = Object.keys(json[0])
  const rows = json.map(Object.values)
  const mdast = {
    type: 'root',
    children: [createTable(headers, rows)]
  }

  const markdownTable = toMarkdown(mdast, {
    extensions: [
      gfmTableToMarkdown({
        tablePipeAlign: alignPipes
      })
    ]
  })

  // Add the Markdown table to the summary
  core.summary
    .addDetails('Generated Markdown table', `\n\n${markdownTable}\n`)
    .write()

  // Return the Markdown table
  return markdownTable
}
