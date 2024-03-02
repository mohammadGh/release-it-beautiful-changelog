# release-it-beautiful-changelog
A plugin for **`release-it`** that uses **`@unjs/changelogen`** to generate beautiful change-logs and update your project's CHANGELOG.md file based on conventional commits. Leave all the release-related stuff to `release-it` and enjoy the beauty of our change-logs.

 - **[Release-it](https://github.com/unjs/changelogen)** for version management, release management, publish and so on...
 - **[@unjs/changelogen](https://github.com/unjs/changelogen)** for extracting beautiful changelog based on conventional commit

You are free to use `release-it` and `changelogen` independently and make any changes or configurations you need to them. During a new release, this plugin only calls the `changelogen` on-the-fly  and adds the generated changelog to the CHANGELOG.md file.

## Usage
> [!IMPORTANT]
> You must install `changelogen` independently and add it to your project's dependencies. This plugin will work correctly assuming `changelogen` is present.

Now, install this plugin using `npm` or `pnpm`:

```bash
pnpm add -D release-it-beautiful-changelog
```

In `release-it` configuration file (`.release-it.json`) add the `release-it-beautiful-changelog` plugin:

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

## Example

After install plugin and add name of the plugin in `release-it` plugin section, you can use `pnpm release-it` and follow release steps to make your release. the generated changelog will be added to our `CHANGELOG.md` and GitHub's Release-Note (if you release it to github).

For example, the release `v1.0.6` of [`my-typescript-library-starter`](https://github.com/mohammadGh/my-typescript-library-starter) was made with this command:

```bash
pnpm release   // or: pnpm run release-it
```
The below screenshot shows the `release-it`'s cli interactive commands:

![image](https://drive.google.com/uc?export=view&id=1OddYtEhPr0RrH5azc4-_W2ENY7vN4lCJ)
