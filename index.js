#!/usr/bin/env node
'use strict'

const os = require('os')
const path = require('path')
const boxen = require('boxen')
const chalk = require('chalk')

const inquirer = require('inquirer')
const program = require('commander')
const costflow = require('costflow')
const config = require('./config')
const { initConfig, appendToLedger, parseLedgerPath } = require('./file')

const configPath = path.join(os.homedir(), '/.costflow.json')
var userConfig

// todo: display syntax & parser version

/* Promt */
const prompt = function () {
  inquirer.prompt([{
    type: 'input',
    name: 'input',
    message: 'Costflow:'
  }]).then(async answers => {
    const result = await costflow.parse(answers.input, userConfig)
    console.log(boxen(result.output, {
      padding: {
        top: 1,
        right: 5,
        bottom: 1,
        left: 5
      },
      borderColor: 'cyan'
    }))
    if (userConfig.filePath && result.sync) {
      const realFilePath = parseLedgerPath(userConfig.filePath)
      appendToLedger(realFilePath, result.output)
      console.log(`✅ Saved to your ledger file: ${realFilePath}\n`)
    }
    prompt()
  })
}

/* Welcome */
const welcome = async function () {
  userConfig = await initConfig(configPath)
  if (userConfig.isNew) {
    console.log('Config file generated, please update it first: ', configPath)
    process.exit(1)
  }
  console.log(boxen(`Costflow CLI ${config.cliVersion}\n-\nhttps://costflow.io`, {
    padding: {
      top: 1,
      right: 5,
      bottom: 1,
      left: 5
    },
    borderStyle: 'classic',
    borderColor: 'cyan',
    align: 'center'
  }))
  console.log('')
  prompt()
}

/* Commands */
program
  .name('costflow')
  .usage(' ')
  .option('-v, --version', 'output the version number', function () {
    console.log(`Costflow CLI ${config.cliVersion} / Syntax ${config.syntaxVersion} / Parser ${config.parserVersion}`)
    console.log(chalk.blue('https://docs.costflow.io/'))
    process.exit(0)
  })
  .on('command:*', function () {
    welcome()
  })
  .parse(process.argv)
