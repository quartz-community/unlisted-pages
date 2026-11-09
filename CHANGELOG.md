# Changelog

## 1.2.0

### Minor Changes

- 9175ad3: Requires Quartz 5.1 (`quartz.quartzVersion: ">=5.1.0"`): it keeps file-backed virtual pages (e.g. Excalidraw drawings) unlisted through `virtualPageHtmlPlugins`. On an older Quartz the build warns, and fails in CI; update Quartz with `npx quartz upgrade`.

## 1.1.0

### Minor Changes

- 9be2119: `unlisted:` also applies to pages rendered from files that have frontmatter, such as Excalidraw drawings stored as Markdown (`.excalidraw.md`), through Quartz 5.1's `virtualPageHtmlPlugins` (quartz-community/bases-page#11).

## 1.0.1

### Patch Changes

- 39454c3: Releases are published from GitHub Actions with npm trusted publishing, so each version on npm now carries provenance linking it to the commit and workflow that built it. No changes to the package itself.

## 1.0.0

### Major Changes

- Stable 1.0 release. All `@quartz-community/*` dependencies now use `^1.0.0` ranges.

  Pre-1.0 caret ranges pinned the minor version (`^0.2.1` means `>=0.2.1 <0.3.0`), so
  published fixes to shared packages could never be resolved by dependents. Moving the
  ecosystem to 1.0 makes caret ranges behave conventionally.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release.
- `UnlistedPages` transformer: zero-config rehype plugin that copies `file.data.frontmatter.unlisted` to `file.data.unlisted` when it is a boolean. Enables the `file.data.unlisted` convention respected by `content-index`, `search`, `backlinks`, `recent-notes`, `folder-page`, and `tag-page` to work for any page, not only encrypted ones.
