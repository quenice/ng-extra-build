# ng-extra-build
`ng-extra-build` is a build tool for `angular-cli`. You can use `ng-extra-build` to build multi-environment
# Getting Started
## Installation
```
npm install ng-extra-build --save-dev
```

# Usage
## Configuration file
After `ng-extra-build` installation is completed, you can find a configuration file named `build.conf.json` in `$your_project_dir`, you should modify this file as your requirements. See [details configuration](#API).

## Command
Append below command after `angular-cli` build command:
```
ng-extra-build -env=envName -config=config-file-path
```

For example, if `neware` is one of your envoriment name, add below json content in `$Your_project_dir/package.json`:

```json
{
  ...
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "neware": "ng build -prod -sm=false -aot -e neware && ng-extra-build -env=neware"
  },
  ...
}
```
And then execute `npm run neware` to build application for production.

### Command Arguments

Argument | Required | Default | Description
---|---|---|---
`-env` | `true` | `null` | Envrionment name
`-config` | `false` | `build.conf.json` | Configuration file path. The file path is relative to current working direction (same as `path.cwd()` in `nodejs`)


# Configuration file schema


