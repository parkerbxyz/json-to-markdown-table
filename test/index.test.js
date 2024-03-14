import core from '@actions/core'
import test from 'ava'
import sinon from 'sinon'
import tmp from 'tmp'
import { run } from '../index.js'

const json = [
  { column1: 'Row 1', column2: 1, column3: true },
  { column1: 'Row 2', column2: 2, column3: true },
  { column1: 'Row 3', column2: 3, column3: false }
]

test('A Markdown table is generated from the provided JSON', async (t) => {
  t.snapshot(await run(core, json))
})

test('A Markdown table without aligned delimiters is generated from the provided JSON', async (t) => {
  const alignPipes = false
  t.snapshot(await run(core, json, alignPipes))
})

test.serial('Summary file is generated with expected content', async (t) => {
  const core = {
    summary: {
      addDetails: sinon.stub().returnsThis(),
      write: sinon.stub()
    },
    info: sinon.stub()
  }

  // Create a temporary file to store the summary buffer when running locally
  const tmpSummaryFile = tmp.fileSync({ postfix: '.md' })
  process.env.GITHUB_STEP_SUMMARY = tmpSummaryFile.name

  await run(core, json)
  t.snapshot(core.summary.addDetails.args)
})
