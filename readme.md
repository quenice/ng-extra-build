# ng-extra-build
`ng-extra-build` is a build tool for `angular-cli`, you can use this for extra building tasks that `angular-cli` can't do, especially for *multi-environment*.


# Getting Started
## Installation
```
npm install ng-extra-build --save-dev
```

## Usage
### Configuration
After `ng-extra-build` installation is completed, you can find a configuration file named `build.conf.json` in `$your_project_dir`, you should modify this file as your requirements. See [Configuration Reference](#configuration-reference).

### Command
Splice the following commands behind the`angular-cli` build command:

```
ng-extra-build -env=envName -config=config-file-path
```

For example, if `neware` is one of your envoriment name, add below json contents in `$Your_project_dir/package.json`:

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
And then

```
npm run neware
```

to build application for envrionment `neware`.

#### Command Arguments

Argument | Required | Default | Description
---|---|---|---
`-env` | `true` | `null` | Envrionment name
`-config` | `false` | `build.conf.json` | Configuration file path. The file path is relative to current working direction (same as `path.cwd()` in `nodejs`)

# Features
## Copy
Copy files from source code to dist.

**build.conf.json**

```
"copy": [
  {
    "from": "$root/src/env/$env/favicon.ico",
    "to": "$dist/favicon.ico"
  }
]
```
It will copy file from `$root/src/env/$env/favicon.ico` to `$dist/favicon.ico`

## Compile css.
Compile and compress `css` file from source code to dist.

**build.conf.json**

```
"css": {
  "from": "$root/src/env/$env/css/theme.css",
  "to": "$dist/assets/css",
  "devUrl": "env/neware/css/theme.css"
}
```
1. Compile and compress file from `$root/src/env/$env/css/theme.css` to `$dist/assets/css`.
2. When development mode, we can add below codes into `src/index.html`

   ```
   <link rel="stylesheet" href="env/neware/css/theme.css"/>
   ```

3. After compiled, will automatic replace `env/neware/css/theme.css` with new `href` which can link to the compied css file. You don't need do anything.

## i18n
Megre `i18n` i18n files to help you handle different `i18n` values in different environments

**build.conf.json**

```
"i18n": {
  "source": "$root/src/assets/i18n",
  "extra": "$root/src/env/$env/i18n",
  "target": "$dist/assets/i18n"
}
```

## Replacement
Replace content in specified file

```
"replacement": [
  {
    "file": "$dist/index.html",
    "contents": [
      {
        "replace": "Neware Club",
        "with": "xxx",
        "withEnv": {
          "neware": "Neware RSP",
          "joy": "Joytele RSP"
        }
      }
    ]
  }
],
```
If `withEnv` is not null, will cover `with`.

## Deletiton
Delete files.

```
"deletion": [
  "$dist/env"
],
```

## Compression
Compress directory to a single `zip` file to specified directory.

```
  "compression": {
    "from": "$dist",
    "to": "$root"
  }
```

The file name rule is: {`$env`}-{`package.json`.`name`}-{`package.json`.`version`}.zip.

For example, `package.json` is:
```
{
  "name": "euicc-portal",
  "version": "1.0.0",
  "scripts": {
    "neware": "ng build -prod -sm=false -aot -e neware && ng-extra-build -env=neware",
    "joy": "ng build -prod -sm=false -aot -e joy && ng-extra-build -env=joy"
  }
}
```

And when you execute:

```
npm run neware
```

The `zip` file's name is : `neware-euicc-portal.1.0.0.zip`

# Configuration Reference

## Constants
There are 3 constants in `build.conf.json`

Name | Value
---|---
`$root` | Project root directory
`$dist` | The output directory for build results.
`$env` | Name of the envrionment currently being building. Its name is same as command argument you passed in the command line. For example, you may execute command: `ng-extra-build -env=neware`, then `$env` = `neware`


## Configuration

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
* **replacement** (`array`): Replacement configurations
  * *file* (`string`): The file (path) you want to execute the replacement.
  * *contents* (`array`): Contents you want to replace.
    * *replace* (`string`): Contents you want to replace.
    * *with* (`string`): Contents you want to replace with
    * *withEnv* (`object`): Contents you want to replace with for the specified environment. key is *environment name*, value is corresponding content you want to replace with.
* **deletion** (`array`): Files you want to delete.
* **compression** (`object`): Compression configurations.

# Recommend Directory Tree

```text
src
├── joy
│   ├── css
│   │   └── theme.css
│   ├── favicon.ico
│   └── i18n
│       ├── cn.json
│       ├── hk.json
│       └── us.json
└── neware
│   ├── css
│   │   └── theme.css
│   ├── favicon.ico
│   └── i18n
│       ├── cn.json
│       ├── hk.json
│       └── us.json
└── ntt
    ├── css
    │   └── theme.css
    ├── favicon.ico
    └── i18n
        ├── cn.json
        ├── hk.json
        └── us.json
    ...
    ...
```

`neware` / `joy` / `ntt` are environments.

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
