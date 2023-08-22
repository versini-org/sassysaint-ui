# Sassy Saint UI

## Introduction

This repository is a monorepo. There are multiple packages available under the ["packages"](https://github.com/aversini/sassysaint-ui/tree/main/packages) folder.

## Node.js compatibility

All packages are:

- pure ESM packages, which means to use them, your packages have to use ESM too (`"type": "module"` should be set in `your package.json` file).
- this does not apply to CLI tools as they can simply be called on the command line.
- compatible with Node.js v20 and above.
