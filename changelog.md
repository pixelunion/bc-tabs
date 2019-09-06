# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.4] - 2019-09-06

### Changed
- jQuery version updated to avoid security risks

## [1.0.3] - 2018-05-13

### Fixed
- Correct slide jumping on accordion display

## [1.0.2] - 2017-05-12

### Fixed
- Added unload to remove bc-tabs if content with tabs is updated, refreshed or replaced

### Changed
- Updated jQuery to 3.1

## [1.0.1] - 2017-05-16

### Fixed
- isSticky bug fix

## [1.0.0] - 2017-05-12

### Changed
- Overhaul, allows for accordion sliding among other things

## [0.4.1] - 2017-01-01

### Added
- added a pre-commit hook to update dist/ folder with compiled JS so module works from npm

## [0.4.0] - 2016-04-11

### Changed
- Module now makes use of webpack for compilation and local development server
- Moved some files around: packaged / minified module is available under `dist`
  while source code / unminified code is all under `src`

## [0.3.1] - 2016-04-08

- Original version of the module: works well with most of our first two or
  three rounds of Bigcommerce themes. Specifically required JSPM.
