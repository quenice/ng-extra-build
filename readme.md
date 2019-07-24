# ng-extra-build
`ng-extra-build` is a build tool for `angular-cli`, you can use this for extra building tasks that `angular-cli` can't do, especially for *multi-environment*.

## Features
- Copy resources for the specified environment.
- Compile and compress `css` file for the specified environment.
- Merge `i18n` files for the specified environment.
- Replace contents in final packaged file for the specified environment.
- Delete files
- Compress files


# Getting Started
## Installation
```
npm install ng-extra-build --save-dev
```

## Usage
### Configuration
After `ng-extra-build` installation is completed, you can find a configuration file named `build.conf.json` in `$your_project_dir`, you should modify this file as your requirements. See [Configuration Reference](#configuration-reference).

### Command
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

#### Command Arguments

Argument | Required | Default | Description
---|---|---|---
`-env` | `true` | `null` | Envrionment name
`-config` | `false` | `build.conf.json` | Configuration file path. The file path is relative to current working direction (same as `path.cwd()` in `nodejs`)


# Configuration Reference
* **base** (`object`): The base config.
  * *outDir* (`string`): The output directory for build results.This value must set be same as `outDir` in **Angular CLI**.
* **copy** (`array`): Copy resources into `outDir`.
  * *from* (`string`): Source file which will be copied.
  * *to* (`string`): Destination file which will be copied to.
* **css** (`object`): Css compile options.
  * *from* (`string`): Source css file.
  * *to* (`string`): Destination css file.
  * *devUrl* (`string`): The css `href` in tag `<link>` in `index.html` for the development environment.After build, will replace this `href` with production environment `href`.

* **i18n** (`object`): Build options for i18n files
  * *source* (`string`): Directory of source i18n files
  * *extra* (`string`): Directory of extra i18n files
  * *target* (`string`): Directory of target i18n files
* **replacement** (`object`): Replacement configurations
  * *file*
  * *contents*
    * *replace*
    * *with*
    * *withEnv*
* **deletion**
* **compression**

# Example Configuration File

```json
{
  "$schema": "./node_modules/ng-extra-build/schema.json",
  "base": {
    "outDir": "dist"
  },
  "copy": [
    {
      "from": "$root/src/env/$env/favicon.ico",
      "to": "$dist/favicon.ico"
    }
  ],
  "css": {
    "from": "$root/src/env/$env/css/theme.css",
    "to": "$dist/assets/css",
    "devUrl": "env/neware/css/theme.css"
  },
  "i18n": {
    "source": "$root/src/assets/i18n",
    "extra": "$root/src/env/$env/i18n",
    "target": "$dist/assets/i18n"
  },
  "replacement": [
    {
      "file": "$dist/index.html",
      "contents": [
        {
          "replace": "Neware Club",
          "withEnv": {
            "neware": "Neware RSP",
            "joy": "Joytele RSP"
          }
        }
      ]
    }
  ],
  "deletion": [
    "$dist/env"
  ],
  "compression": {
    "from": "$dist",
    "to": "$root"
  }
}

```
