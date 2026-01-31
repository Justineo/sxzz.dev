---
title: "War Stories: Windows and the Frontend Toolchain"
date: 2025-03-07
description: From backslashes and drive letters to env vars, a tour of Windows compatibility pain points in Node.js tooling.
---

## Preface

Yesterday I tweeted about yet another Windows compatibility issue while working on tooling, so I vented a little. In the Twitter atmosphere, only these kinds of "hot takes" seem to get attention, which triggered some complaints and even a Windows vs. macOS debate.

So let's talk about Windows tooling "pitfalls" from a Unix-like perspective, especially in the Node.js frontend toolchain.

## Path Troubles

### The weird backslash

On Windows, a common path looks like `D:\path\to\file.txt`; on Unix-like systems, it's `/home/username/file.txt`.
It's obvious that Windows uses backslashes `\` as path separators, while in most programming languages, forward slashes usually need no special handling and backslashes are escape characters.
For example:

```ts
console.log('\\') // outputs a single backslash
console.log('\n') // outputs a newline
console.log('/') // outputs a forward slash, no surprises
```

This means that if you only run on Unix-like systems, you can mostly ignore special path handling.

### The `:` separator

Windows also has drive letters, while Linux uses mounts to manage different disks/partitions. This is another compatibility concern.

### 🌰 An example

Talking is cheap -- let's use a real example. You can search GitHub for [my Windows pain](https://github.com/search?q=committer%3Asxzz+windows&type=commits).

#### [test: try fix path for windows](https://github.com/sxzz/tsdown/commit/5f490037c95758026708013375792accb4c3d647)

This commit aimed to fix unit tests on Windows. We needed to pass a [glob expression](<https://en.wikipedia.org/wiki/Glob_(programming)>) to the `entry` option. On Unix-like systems, you can pass a file path like `/path/to/file` to match a specific file, which works great.

But globbing originated on UNIX. On Windows, backslashes don't work properly in [fast-glob](https://github.com/mrmlnc/fast-glob) the way they do on Unix-like systems, causing inconsistencies.
Although `fast-glob` provides `convertPathToPattern` to escape Windows backslashes, it still doesn't cover every case.

The worst part of this commit: I used 4 backslashes in code. Why? Because the string was wrapped by both backticks <code>`</code> and single quotes `'`, so those 4 backslashes eventually represented only one real backslash.

#### [fix: watch `ignored` option for windows](https://github.com/sxzz/tsdown/commit/4c251ac3c5c8b2a94a8d22861c2437647f6cb276)

Another common example: we use a regex to check if a path is inside `node_modules`. To support Windows we need `/[\\/]node_modules[\\/]/`. Again, the double backslashes eventually match a single backslash.
But what's more annoying is that for third-party dependencies, you can't be sure whether Windows will pass backslash paths or normalize them to forward slashes.
In this case, `chokidar` behaves oddly: for function inputs it passes forward slashes, while for static arrays it applies special handling. Hence this commit.

#### [fix: support Node 22/23 strip types feature](https://github.com/antfu-collective/unconfig/pull/40)

Remember the `:` separator I mentioned? I used to think it wasn't a compatibility issue. Naive!
If you want to import an absolute path in Node.js, it's simple on Unix-like systems:

```ts
require('/path/to/test.cjs')
```

Boring. But on Windows you can run into trouble:

```ts
require('C:\\path\\test.cjs') // ✅
import('C:\\path\\test.cjs') // ❌
// Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'
```

That's because `require` seems to accept paths, while `import()` supports both paths and file URLs. Node.js treats `C:` as a URL protocol, just like `http:`. File URLs and paths get mixed up 🤷

```ts
import('file://C:/path/test.cjs') // ✅
console.log(new URL('C:\\path\\test.cjs')) // protocol = 'c:'
```

#### import statements

```ts
import mod from 'a/b/n'
import mod from 'a\b\n'
```

In ESM, you must use forward slashes as separators. Using backslashes directly can cause unexpected escaping. Code generation tools need to be extra careful.

### 🤨 What can we do?

Maybe try [pathe](https://github.com/unjs/pathe)! Even on Windows it converts paths to forward slashes. And Windows treats forward slashes as backslashes, so in most cases this solves consistency issues. But there are still edge cases.

## The open-source community

As far as I know, most people who develop and contribute to open-source projects use Unix-like systems, while many users might be on Windows. That probably relates to market share, but for authors and maintainers it's still unfortunate.

For example, my open-source projects rely on GitHub Actions to run unit tests on Windows. Every time I push code and get a failing Windows CI notification, it's frustrating because I don't have a Windows machine set up locally. So I end up using a VM to debug Windows bugs.

And unit tests never cover everything, so real users still need to find issues and report them!

## Compatibility checklist

- Paths
  - Backslashes
    - Might need escaping
    - Might need converting to forward slashes
  - Drive letters `:`
    - Might need converting to file URLs
- Can't set env vars with `KEY=VALUE command`
  - Use pnpm's [`shell-emulator`](https://pnpm.io/cli/run#shell-emulator)
  - Or use [`cross-env`](https://www.npmjs.com/package/cross-env)
- No `rm -fr` command
  - Use `fs.rmSync(path, { recursive: true, force: true })`
  - Or use [`rimraf`](https://www.npmjs.com/package/rimraf)

There are countless issues like these. I can't list them all -- these are just the ones that stick in my memory.

## Afterword

Just because you hit ten path issues doesn't mean there are only ten -- there are likely more on the way 🛣️ ... so I can't accept comments like "you can't even handle paths correctly."

If you noticed, I've used the term [`Unix-like`](https://en.wikipedia.org/wiki/Unix-like) throughout this article. That's because besides Windows, there are many other operating systems.
