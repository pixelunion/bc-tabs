# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

##[ 0.4.1 ] - 2017-01-01

### Added
- added a pre-commit hook to update dist/ folder with compiled JS so module works from npm

##[ 0.4.0 ] - 2016-04-11

### Changed
- Module now makes use of webpack for compilation and local development server
- Moved some files around: packaged / minified module is available under `dist`
  while source code / unminified code is all under `src`

##[ 0.3.1 ] - 2016-04-08

- Original version of the module: works well with most of our first two or
  three rounds of Bigcommerce themes. Specifically required JSPM.
