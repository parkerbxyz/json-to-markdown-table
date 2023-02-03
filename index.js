// @ts-check
import core from '@actions/core'
import tablemark from 'tablemark'

// We export the `run` function for testing
// Call `run()` directly if this file is the entry point

// If this file is being run directly
if (import.meta.url.endsWith(process.argv[1])) {
  const json = JSON.parse(core.getInput('json'))

  core.setOutput(
    'table',
    await run(core, json).catch((error) => {
      core.setFailed(error)
    })
  )
}

/**
 * @param {import("@actions/core")} core
 * @param {import("tablemark").InputData<import("tablemark").LooseObject>} json
 */
export async function run(core, json) {
  const markdownTable = tablemark(json)

  // Add the Markdown table to the summary
  core.summary
    .addDetails('Generated Markdown table', `\n\n${markdownTable}\n`)
    .write()

  // Return the Markdown table
  return markdownTable
}
