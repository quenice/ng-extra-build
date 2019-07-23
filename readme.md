# ng-extra-build
`ng-extra-build` is a build tool for `angular-cli`. You can use `ng-extra-build` to build multi-environment
# Getting Started
## Installation
```
npm install ng-extra-build --save-dev
```

## Usage
### Configuration
After `ng-extra-build` installation is completed, you can find a configuration file named `build.conf.json` in `$your_project_dir`, you should modify this file as your requirements. See [Configuration Reference](#Configuration Reference).

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
```json
{
  "$schema": "http://json-schema.org/schema",
  "title": "Angular Extra Build Cli Schema",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "base": {
      "description": "The base configurations",
      "type": "object",
      "properties": {
        "outDir": {
          "type": "string",
          "default": "dist",
          "description": "The output directory for build results."
        }
      }
    },
    "copy": {
      "description": "Copy configurations (just support file)",
      "type": "array",
      "items": {
        "description": "(Array-Item) Copy configurations",
        "type": "object",
        "properties": {
          "from": {
            "type": "string",
            "description": "Source file of be copied"
          },
          "to": {
            "type": "string",
            "description": "Destination file of be copied"
          }
        },
        "required": [
          "from",
          "to"
        ]
      }
    },
    "css": {
      "description": "Css compiler options",
      "type": "object",
      "properties": {
        "from": {
          "type": "string",
          "description": "Source file to be compiled"
        },
        "to": {
          "type": "string",
          "description": "Destination file of the compiled operation"
        },
        "devUrl": {
          "type": "string",
          "description": "The css link in tag <link> in index.html for the development"
        }
      },
      "required": [
        "from",
        "to"
      ]
    },
    "i18n": {
      "description": "Build options for i18n file(s)",
      "type": "object",
      "properties": {
        "source": {
          "type": "string",
          "description": "Directory of source i18n file(s)"
        },
        "extra": {
          "type": "string",
          "description": "Directory of extra i18n file(s)"
        },
        "target": {
          "type": "string",
          "description": "Directory of target i18n file(s)"
        }
      },
      "required": [
        "source",
        "target",
        "extra"
      ]
    },
    "replacement": {
      "description": "",
      "type": "array",
      "items": {
        "description": "Replacement configurations",
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "description": "The file (path) you want to execute the replacement"
          },
          "contents": {
            "type": "array",
            "description": "(Array) Contents you want to replace to and be replaced",
            "items": {
              "type": "object",
              "description": "(Array-Item) Contents you want to replace to and be replaced",
              "properties": {
                "replace": {
                  "type": "string",
                  "description": "Contents you want to be replaced"
                },
                "with": {
                  "type": "string",
                  "description": "Contents you want to replace to"
                },
                "withEnv": {
                  "type": "object",
                  "description": "Environment name and corresponding contents you want to replace to in a particular environment"
                }
              },
              "required": [
                "replace"
              ]
            }
          }
        },
        "required": [
          "file",
          "contents"
        ]
      }
    },
    "deletion": {
      "type": "array",
      "description": "(Array) Files or directorys you want to delete",
      "items": {
        "type": "string",
        "description": "(Array-item) File or directory you want to delete"
      }
    },
    "compression": {
      "type": "object",
      "description": "Compression configurations",
      "properties": {
        "extension": {
          "description": "Extension of the compressed file",
          "type": "string",
          "default": "zip",
          "enum": [
            "zip",
            "tar",
            "gz"
          ]
        },
        "from": {
          "type": "string",
          "description": "Prepare compressed directory"
        },
        "to": {
          "type": "string",
          "description": "Compressed file"
        }
      },
      "required": [
        "from",
        "to"
      ]
    }
  }
}

```

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
