# Board Game Arena: Type Safe Template

<table><tr>
	<td> Author: NevinAF </td>
	<td> Version: 1.0.0 </td>
	<td> Date: March 18, 2024 </td>
</tr></table>

A starting template built with type safety in mind, containing:
- Typescript with
	- Nearly full typing for all BGA and Dojo components and heavy documentation.
	- Detailed yet simple typechecking using expandable types for game states, player actions, notifications, and gamedatas.
	- Cookbook recipes for common game mechanics and components, pulled from the BGA documentation and other sources.
- Schema files for all major BGA data files (game states, infos, options, stats, and preferences).
- SCSS support with a one-to-one replacement.
- Better PHP intellisense and error checking, as well as auto generating files and type enforcement.

*ALL of the above features are optional and can be enabled/disabled in the `template.config.jsonc` file.*

## Table of Contents

- [Getting Started](#getting-started)
- [Existing Project](#existing-project)
- [Usage](#usage)
	- [Package.json Scripts](#packagejson-scripts)
	- [Generated Files](#generated-files)
- [Cookbook](#cookbook)

## Getting Started

> `npm` is used in this guide, but `yarn` can be used as well.

1. **Download node.js and npm** [here](https://nodejs.org/en/download/) (if not already installed). BGA does not have typescript compilation for server files; therefore, the typescript must be compiled to a javascript file in order to run any typescript code on game clients. Compiling typescript requires the installation of node.js and npm.

2. **Clone (or download) [this repository](https://github.com/NevinAF/bga-ts-template)**. There are no restrictions on the name or placement of the cloned folder, although it is recommended to rename the folder to `src` and place it in the project directory. This will let all source files sync to the server.

> Step 2 can be skipped by instead overriding the bga project with `EmptyProjectTS` using option under `Source code version control` in the manage game page. This will ensure the project structure is correct, but this is not recommended. Cloning from the git repository is the best way to ensure that the template is up to date and it provides no benefits other than placing the files in the recommended location.

3. **Open and fill-in `template.config.jsonc`**. All `_TODO_` fields are required and will prevent the init script from running. You can also change any of the other values to fit your preferences.

```json
{
	"yourgamename": "_TODO_",
	"developer-names": "_TODO_",
	"developer-emails": "_TODO_",
	"bga-project-folder": "_TODO_/",

	"typescript-client": true,
	"scss-client": true,
	...
}
```

> Some options, like most `*.jsonc` options, might seem unneeded/redundant to some developers. All options are optional and only serve to add better autofill and error correction.

4. **Run `npm run init`** in a terminal on the bga-ts-template directory. This will install the necessary dependencies and create+build your project files based on the config.

	- If you use an IDE like Visual Studio Code, there will likely be a prompt to run any tasks when looking at the `package.json` file. This will automatically run `npm run init` for you at the correct directory.

	- Only the `devDependencies` that are needed by your configuration are installed. In addition, if you have any of these dependencies already installed globally, `-g`, they will not be installed locally.

	- This action will overwrite ALL existing project files that are targeted by your configuration! Make sure to back up any files before running this command.

5. (optional) If you want to use the cookbook recipes, see the [Cookbook](#cookbook) section for more information.

**Continue to the [Usage](#usage) section** for more information on how to use the generated files, and rebuild the project whenever you make any changes.

## Existing Project

Unfortunately, there is not a great way to convert the bga template js file to a ts class, however, the steps to convert the existing project to typescript are relatively simple.

1. **Follow all of the steps in the [Getting Started](#getting-started) section**.  MAKE SURE TO BACKUP ALL FILES BEFORE RUNNING `npm run init`!

2. **Copy contents** of existing game file to `<yourgamename>.ts`.

3. **Copy and paste the list of `define` dependencies**. This is the topmost part of the file and looks very similar to the js define function (other than last parameter to the declare method).

4. **Inside the `yourgamename.ts` file, replace**:
	```js
	define([
		"dojo","dojo/_base/declare",
		"ebg/core/gamegui",
		"ebg/counter",
		// Other dependencies...
	],
	function (dojo, declare) {
		return declare("bgagame.tutorialeuchre", ebg.core.gamegui, {
			// ... class code ...
		});
	});
	```
	with:
	```ts
	/// <reference path="<yourgamename>.d.ts" />

	interface YourGameName extends Gamegui {} // Alias for your game

	class YourGameName {
		// ... class code ...
	}
	```

5. **Reformat** the punctuation of the `... class code ...` to match the typescript syntax class syntax. This usually only requires modifying the `construction` signature, and removing all commas at the end of the class properties.

6. (optional) Replace the signatures of the five main methods (`setup`, `onEnteringState`, `onLeavingState`, `onUpdateActionButtons`, `setupNotifications`) with the `Gamegui` signatures. This will enable typechecking and intellisense on arguments for these methods.

*Before deleting/overriding the template generated files, like `yourgamename.ts`, you should look at the structure and comments in the file. These provide great documentation for how the typescript project works.*

**Continue to the [Usage](#usage) section** for more information on how to use the generated files, and rebuild the project whenever you make any changes.

## Usage

All initially downloaded files are not intended to be modified, with the exception of the `template.config.jsonc` file. Running `npm run init` will create modifiable files which can be used to create game specific code.

### Package.json Scripts

There are three commands that can be run using npm scripts:

- **`npm run init`**: As described in the [Getting Started](#getting-started) section, this command will install the necessary dependencies and create+build your project files based on the config. *This is always additive and only missing files are ever generated.*

- **`npm run build`**: This command is always run after `npm run init` and is used to build all files based on existing files.

	- This command only differed from `npm run init` when files/dependencies have been deleted, or when anything is added to the `template.config.jsonc` file. Running init will regenerate these files and build will not. use this over init for better performance.

	- This command looks for existing files and does not use the `template.config.jsonc` file. For example, if the `client/tsconfig.json` file exists, typescript will always compile using that configuration.

- **`npm run watch`**: This command is used to watch for changes in the source files and automatically rebuild the project. This is identical to running `npm run build` after every change.

	- Only files/folders that exist when starting the watch command will be watched. If you add a new file like `shared/gameoptions.jsonc`, this file will not be watched until the watch command is restarted. *Some commands like Typescript and SCSS will start if there is a valid target file, then will watch for folder wide changes.*

### Generated Files

All configuration options add/change files that are generated for game specific code. These are the configurations with file descriptions:

- **Typescript Files** (when enabled)

	There are only five files generated with the base typescript flag, all located in `client/`:
	- `yourgamename.ts`:
		- Defines all references that this game needs to compile using reference tags. Only files that are included as a reference will be included in the final js file and errors will be thrown if a reference was not included.
		- Contains all game specific logic (or references tags to all game logic). If you want to expand the class to multiple files, you should use the partial class syntax as described on the JSDocs of `YourGameName` interface.
	- `yourgamename.d.ts`:
		- Expands all bga framework types for better typechecking and intellisense. The types that are expanded are `DojoDependencies`, `GameStates`, `PlayerActions`, `NotifTypes`, and `Gamedatas`. All of these types have documentation and examples defined using JSDocs.
			- If `gamestates.jsonc` is enabled, the `GameStates` and `PlayerActions` types are automatically generated.
		- Contains all game specific types and interfaces.
		- This is a type file and can be broken up into multiple files as long as the references are included wherever the types are used.
	- `define.ts`:
		- Contains the `define` function that is used to define the game.
		- The only section of this file that should be changed are the dependencies. When adding Dojo Toolkit dependencies, you should add them to the `DojoDependencies` interface in `yourgamename.d.ts`.
	- `tsconfig.json`:
		- Contains the typescript configuration for the project. This file does not need to be modified, unless you want to change the typescript configuration like preserving the comments.
	- `build/index.d.ts`:
		- This index file includes the index file of all framework types.
		- The index file for importing all built d.ts files. When using other configuration options like `gamestates.jsonc`, this file will be updated to include all generated d.ts files without manually adding them.
		- This file is auto generated and should not be modified.

> All other files TS files used for types and cookbook recipes are located in `template/client/`. These can be modified if there is an error or an API update that requires a change, but general should not be touched.

- **JSONC Files**

	There are few of these files and are all generated in `shared/`. With the exception of `gamestates.jsonc`, these files are a one-to-one replacement of base files with matching names, but offer better auto-completion and error checking. When building, these files are converted to JSON/php files and replace the bga-project files with the same naming.

	The `gamestates.jsonc` has a lot of extra features and is used to autogenerate the `yourgamename.actions.php` and `states.inc.php` files. These auto generated files will also enforce function names and typechecking (when types are defined in .game.php). In addition, this will generate the `GameStates` and `PlayerActions` types if typescript is enabled.

- **VSCode Settings**

	Board Game Arena explicitly recommends using Visual Studio Code for development. Given that, there is also an option provides to set up the settings for Visual Studio Code. This will add a `.vscode` folder with a few files based on the configuration options:

	- `settings.json`. Settings for the project include:
		- `intelephense` extension settings for the shared code path and php version.
		- Enables `emmet` syntax for `*.tpl` files.
		- `json.schemas` settings for all bga-specific files.
	- `sftp.json`. All settings for the SFTP excluding the username and password. Not that this is set up to upload files that are built unlike the default settings which only upload when a files is saved from within the editor.
	- `php.json`. All snippets recommended by bga for php development.

	All settings are constructive and will not override/replace any existing settings. *Comments are not preserved in these files*.

- **SCSS Files** (when enabled)

	The BGA framework expects a single css file without imports. As such, the scss command compiles a one-to-one replacement of the `client/yourgamename.scss` file to `yourgamename.css`. Your scss file can be broken up into multiple files, but all files must be imported into the `yourgamename.scss` file.

## Cookbook

The cookbook contains recipes for common game mechanics and components. These recipes are pulled from the BGA documentation and other sources. If you want to use any of the cookbook recipes, you can extend the `GameguiCookbook` class and include any modules using reference tags:

```ts
/// <reference path="cookbook/common.d.ts" />

class YourGameName extends GameguiCookbook {
	// ... class code ...
}
```

Using the common cookbook module is recommended as it contains function that are used in nearly every game, and wrappers for much more concise and type safe code. The two big functions in this module are:
- `ajaxAction`: Typed `ajaxcallWrapper` method recommended by the BGA wiki. This method removes obsolete parameters, simplifies action url, and auto adds the lock parameter to the args if needed. See JSDocs for more information.
- `subscribeNotif`: A typed dojo.subscribe wrapper for notifications. See JSDocs for more information.

> Note: Recipes (or modules) with the exception of `common` are user defined and may not be fully tested.