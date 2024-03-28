# Board Game Arena: Typescript Source Template

<table><tr>
	<td> Author: NevinAF </td>
	<td> Version: 1.0.0 </td>
	<td> Date: March 18, 2024 </td>
</tr></table>

A starting template built with typescript containing:
- Nearly full typing for all BGA and Dojo components and heavy documentation.
- Detailed yet simple typechecking using expandable types for game states, player actions, notifications, and gamedatas.
- Cookbook recipes for common game mechanics and components, pulled from the BGA documentation and other sources.
- Schema files for all major BGA json files (game options, stats, and game preferences).

## Table of Contents

- [Getting Started](#getting-started)
- [Existing Project](#existing-project)
- [Usage](#usage)
- [Cookbook](#cookbook)
- [JSON Schema Files](#json-schema-files)

## Getting Started

> `npm` is used in this guide, but `yarn` can be used as well.

1. Download node.js and npm [here](https://nodejs.org/en/download/) (if not already installed). BGA does not have typescript compilation for server files; therefore, the typescript must be compiled to a javascript file in order to run any typescript code on game clients. Compiling typescript requires the installation of node.js and npm.

2. Clone (or download) this repository into any bga project folder. There are no restrictions on the name of the cloned folder, although it is recommended to rename the folder to `src`. The project structure should look as follows:

```py
bga-project/
# This is the cloned repository
├── src/  
│   ├── cookbook/
│   ├── types/
│   ├── .gitignore
│   ├── .yourgamename.d.ts
│   ├── README.md
|   ├── ...
# Base BGA project files
├── img/
├── modules/
├── dbmodel.sql
├── gameoptions.inc.php
├── <yourgamename>.game.php
├── <yourgamename>.js
├── ...
```

> Step 2 can be skipped by instead overriding the bga project with `EmptyProjectTS` using option under `Source code version control` in the manage game page. This will ensure the project structure is correct, but this is not recommended. Cloning from the git repository is the best way to ensure that the template is up to date and it provides no benefits other than placing the files in the correct location.

3. Open a terminal on the bga-ts-template. Run `npm run build` to install the necessary dependencies and verify that typescript project is set up correctly.
	- If you use an IDE like Visual Studio Code, there will likely be a prompt to run any tasks when looking at the `package.json` file. This will automatically run `npm run build` for you at the correct directory.

	- You can also run `npm run watch` which rebuilds the javascript file immediately after saving any changes to the typescript files.

	- This action will overwrite the existing `yourgamename.js` file in the root directory of the BGA project! This should never be an issue unless you renamed the generated `<yourgamename>.js` file to `yourgamename.js`.

4. Rename `yourgamename` and `YourGameName` to the name of your game. The casing of these are important. This can usually be done with a simple find and replace in your IDE. Here are the list of changes that should be made:

	- `package.json`
		- Package name
		- Main file

	- `tsconfig.json`
		- Output file. Running build after changing this file will override the existing `<yourgamename>.js` file.
	- `define.ts`
		- The reference tag
		- The module name and class name in the define function.
		- (optional) The comments which describe the define function.

	- `yourgamename.ts`
		- The name of this file.
		- Several references related types, file names, log statements, and (optional) comment examples.

	- `yourgamename.d.ts`
		- The name of this file.

	> It is usually a good idea to rebuild after renaming these files to ensure that no errors occur before making game specific changes.

5. (optional) If you want to use the cookbook recipes, see the [Cookbook](#cookbook) section for more information.

6. If you use some form of automatic/batched SFTP, you should add the following to the ignore list of your SFTP config. This list matches the default `.gitignore` file in the template:
	- `<src>/.git/`
	- `<src>/node_modules/`
	- `<src>/npm-debug.log`
	- `<src>/package-lock.json`
	- `<src>/yarn-error.log`
	- `<src>/yarn.lock`

## Existing Project

Unfortunately, there is not a great way to convert the bga template js file to a ts class, however, the steps to convert the existing project to typescript are relatively simple.

1. Follow all of the steps in the [Getting Started](#getting-started) section.

2. Copy contents of existing game file to `<yourgamename>.ts`.

3. Inside the `define.ts` file, copy and paste the list of dependencies in the `define` function. This is the topmost part of the file and looks very similar to the js define function (other than last parameter to the declare method).

4. Inside the `yourgamename.ts` file, replace:
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

5. Reformat the punctuation of the `... class code ...` to match the typescript syntax class syntax. This usually only requires modifying the `construction` signature, and removing all commas at the end of the class properties.

6. (optional) Replace the signatures of the five main methods (`setup`, `onEnteringState`, `onLeavingState`, `onUpdateActionButtons`, `setupNotifications`) with the `Gamegui` signatures. This will enable typechecking and intellisense on arguments for these methods.

Before deleting/overriding the old `yourgamename.ts` file, you should look at the structure and comments in the file. These provide great documentation for how the typescript project works.

## Usage

There should only be three files from the initial download that should ever be modified. All sections of these files have examples and documentation (in comments) explaining how to use, modify, and expand the typescript project. These files are as follows:
- `yourgamename.ts`:
	- Defines all references that this game needs to compile using reference tags. Only files that are included as a reference will be included in the final js file and errors will be thrown if a reference was not included.
	- Contains all game specific logic (or references tags to all game logic). If you want to expand the class to multiple files, you should use the partial class syntax as described on the JSDocs of `YourGameName` interface.
- `yourgamename.d.ts`:
	- Expands all bga framework types for better typechecking and intellisense. The types that are expanded are `DojoDependencies`, `GameStates`, `PlayerActions`, `NotifTypes`, and `Gamedatas`. All of these types have documentation and examples defined using JSDocs.
	- Contains all game specific types and interfaces.
	- This is a type file and can be broken up into multiple files as long as the references are included wherever the types are used.
- `define.ts`:
	- Contains the `define` function that is used to define the game.
	- The only section of this file that should be changed are the dependencies. When adding Dojo Toolkit dependencies, you should add them to the `DojoDependencies` interface in `yourgamename.d.ts`.

> All other files can be modified if there is an error or an API update that requires a change. In addition, the you may want you modify a cookbook recipe to fit your game's needs, although you should override the method instead of modifying the cookbook file directly.

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

## JSON Schema Files

The `gameoptions.json`, `gamepreferences.json` and `stats.json` files are used to define several game aspects. To add auto completion, error detection, and tooltips to these files, you can use their respective schema files.

For Visual Studio Code, you can copy-paste the following code snippet into your `settings.json` file to enable this feature. *Replace `src` with this folder name if needed*:

```json
{
	"json.schemas": [
		{
			"fileMatch": [ "gameoptions.json" ],
			"url": "./src/json-schema/gameoptions.schema.json"
		},
		{
			"fileMatch": [ "gamepreferences.json" ],
			"url": "./src/json-schema/gamepreferences.schema.json"
		},
		{
			"fileMatch": [ "stats.json" ],
			"url": "./src/json-schema/stats.schema.json"
		}
	],
}
```