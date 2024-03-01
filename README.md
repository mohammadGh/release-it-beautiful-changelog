# release-it-beautiful-changelog

A release-it plugin using @unjs/changelogen to extract beautiful change-log and update CHANGELOG.md while do all releasing stuff with release-it:
 - **[Release-it](https://github.com/unjs/changelogen)** for version management, release management, publish and so on...
 - **[changelogen](https://github.com/unjs/changelogen)** for extracting beautiful changelog based on conventinal commit
## Usage
> [!IMPORTANT]
> first install `release-it` and `@unjs/changelogen`!

Now, install this plugin using 'npm' or 'pnpm':

```bash
pnpm add -D release-it-beautiful-changelog
```

In release-it configuration file, `.release-it.json` add the `release-it-beautiful-changelog` plugin:
```javascript
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}"
  },
  "github": {
    "release": true,
    "releaseName": "v${version}"
  },
  "npm": {
    "release": true
  },
  "plugins": {
    "release-it-beautiful-changelog": {
      "disable": false,                  // default
      "changelogFile": "./CHANGELOG.md"  // default
    }
  }
}

```
