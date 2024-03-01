import { existsSync, promises } from 'node:fs'
import { Plugin } from 'release-it'

const defaultConfig = {
  changelogFile: './CHANGELOG.md',
  changelogCommand: 'npx changelogen --no-output',
}

class BeautifulChangelogPlugin extends Plugin {
  [x: string]: any

  static isEnabled(option) {
    return !option?.disable
  }

  constructor(...args) {
    super(...args)
  }

  getInitialOptions(options, namespace) {
    const pluginOptions = options[namespace]
    pluginOptions.tagName = options.git?.tagName
    pluginOptions.changelogFile = pluginOptions.changelogFile || defaultConfig.changelogFile
    pluginOptions.changelogCommand = pluginOptions.changelogCommand || defaultConfig.changelogCommand
    return pluginOptions
  }

  async getChangelog(latestVersion) {
    this.debug({ event: 'getChangelog(latestVersion)', latestVersion, options: this.options })
    this.mdChangeLog = await this.exec(this.options.changelogCommand, { options: { write: false } })

    // update changelog content for use in other part of release-it context like release-notes
    this.setContext({ changelog: this.mdChangeLog })

    return this.mdChangeLog
  }

  async bump(version) {
    this.debug({ event: 'bump(version)', version, options: this.options })
    this.setContext({ version })
  }

  async beforeRelease() {
    const { isDryRun } = this.config
    let { version, changelog } = this.getContext()

    // eslint-disable-next-line no-template-curly-in-string
    const tagName = this.options.tagName.replace('${version}', version)

    this.debug(`new version (tagName): ${tagName}`)

    if (changelog) {
      // replace <changelogen's title of this version>> with <new-version>
      changelog = changelog.replace(/^###?\s+.*$/m, `## ${tagName}`)

      // fix <new-version> for compare-git link
      changelog = changelog.replace(/^(\[compare\s+changes\].*\.{3})(.*)$/m, `$1${tagName})`)

      // remove empty lines from begging of the generated changelog
      changelog = changelog.replace(/^\s*[\r\n]+/, '')

      this.setContext({ changelog })
      this.config.setContext({ changelog })

      if (!isDryRun)
        await this.updateChangelogFile(tagName, changelog)
    }
  }

  async afterRelease() {
    const { isDryRun } = this.config
    const { version, changelog, beautifulChangelogResultStatus } = this.getContext()

    if (isDryRun)
      this.log.log(`Beautiful changelog for release ${version} generated as follow (not written to file due to DRY-RUN mode): \n\n${changelog}`)
    else if (beautifulChangelogResultStatus)
      this.log.log(beautifulChangelogResultStatus)
  }

  async updateChangelogFile(newTagName, newChangelog) {
    const beautifulChangelogResultStatus: string = `💅 Beautiful changelog for release ${newTagName} is written to ${this.options.changelogFile}`
    let changelogMD: string

    if (existsSync(this.options.changelogFile)) {
      this.debug(`Reading ${this.options.changelogFile} to add new changelog content`)
      changelogMD = await promises.readFile(this.options.changelogFile, 'utf8')
    }
    else {
      this.debug(`No chang-log file found, creating new file: ${this.options.changelogFile}`)
      changelogMD = '# Changelog\n\n'
    }
    const lastEntry = changelogMD.match(/^###?\s+.*$/m)

    if (lastEntry) {
      changelogMD
          = `${changelogMD.slice(0, lastEntry.index)
          + newChangelog
           }\n\n${
           changelogMD.slice(lastEntry.index)}`
    }
    else {
      changelogMD += `${newChangelog}\n\n`
    }

    // todo check if not in dry-mode
    await promises.writeFile(this.options.changelogFile, changelogMD)
    this.debug(`Beautiful changelog for release ${newTagName} is written to ${this.options.changelogFile}`)

    // add to git for committing with new release
    await this.exec(`git add ${this.options.changelogFile}`)

    this.setContext({ beautifulChangelogResultStatus })
  }
}

export default BeautifulChangelogPlugin
