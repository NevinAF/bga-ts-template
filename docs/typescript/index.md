BGA Type Safe Template - Typescript
===================================

Typescript is by far the biggest reason to use the BGA Type safe template. Typescript is a superset of javascript that adds static typing and other features to the language. This allows for better intellisense, type checking, and overall code quality. The template is set up to be as type safe as possible, but can be configured to be less strict if needed. This document will go over how to use the template, convert an existing project, and how to configure the project to your needs.

## Generate Files

The files that are generated on `npm run init` are the following:

- `<source>/client/tsconfig.json`:
	- Contains the typescript configuration for the project.
	- Add any custom files to the `include` (glob patterns) or `files` (specific files) arrays. You will do this when adding cookbook recipes.
	- For less strict typechecking, you can change any of the compiler options. Check all strickness options [here](https://www.typescriptlang.org/tsconfig#strict).

- `<source>/client/yourgamename.ts`:
	- Contains the main game class, `class YourGameName`.
	- Contains all game specific logic (or imports to all game logic). See file documentation for splitting up game logic.

- `<source>/client/yourgamename.d.ts`:
	- Expands all bga framework types for better typechecking and intellisense. The types that are expanded are, `GameStates`, `PlayerActions`, `NotifTypes`, and `Gamedatas`. All of these types have documentation and examples defined using JSDocs.
		- If `gamestates.jsonc` is enabled, the `GameStates` and `PlayerActions` types are automatically generated.
	- Contains game specific types and interfaces.

## Compilation

### AMD Module Overview

The typescript files are compiled to a single javascript file, `yourgamename.js`, where each source file is formatted as an AMD module:
```js
define("<module-name>", ["<dependency1>", "<dependency2>", ...], function (dependency1, dependency2, ...) {
	...
	return <exports>
});
```

The `<module-name>` is usually generated from the file path, but a triple slash `amd-module` directive can be used to specify the `<module-name>`. This is necessary for the main game file as the specific `<module-name>` is used as a dependency. Without this directive, the code will throw an error stating the `<module-name>` is undefined.

The `<dependencies>` are determined by the imports within the file. If a file is imported, it is added as a dependency and the alias used for any imports are uses as the dependency argument name.

```ts
/// <amd-module name="bgagame/yourgamename"/>

import Gamegui = require('ebg/core/gamegui'); // CommonJS import format
// OR
import * as Gamegui from 'ebg/core/gamegui'; // ES6 import format

class YourGameName {
	...
}

dojo.declare( "bgagame.yourgamename", Gamegui, new YourGameName() );
```

Essentially compiles to:

```js
define("<module-name>", ["ebg/core/gamegui"], function (Gamegui) {
	var YourGameName = (function () {
		...
	});
	dojo.declare( "bgagame.yourgamename", Gamegui, new YourGameName() );
});
```

### Adding files to compilation

Whenever you use `import` from inside `<yourgamename>[.d].ts` targeting a `.ts` or `.js` file, that file will automatically be added to the compilation without needing to update the `tsconfig.json` file. If the includes import or exports, the file will be automatically packaged as an AMD module. Otherwise, the code will run directly in the global scope.

```ts
// playerActions.ts
import Gamegui = require('ebg/core/gamegui');

export function playCard(game: Gamegui, card_id: number) {
	...
}

// yourgamename.ts
import { playCard } from './playerActions'; // Automatically added to compilation

class YourGameName {
	...
	callback(index: number) {
		playCard(this, index);
	}
	...
}
```

### Game Class Splitting

There are several situations where you want to define components of your game class in different files, usually for organization or readability. This can be done several ways but each have their own tradeoffs. All of these methods can be found [here](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

If you are interested in mimicking how the bga framework and cookbook recipes are set up, you can implement the following template in any file:

```ts
// custom.ts
// ... <imports> ...

const CustomMixin = <TBase extends new (...args: any[]) => Gamegui>(Base: TBase) => class Custom extends Base {
	// ... <class code> ...
};

export = CustomMixin;
```

To use this module, see the following section on [Mixin Modules](/docs/typescript/index.md#mixin-modules).

### Mixin Modules

Typescript currently has no way good way to define a partial class which is defined in multiple modules. One of the common ways to work around this are [typescript mixins](https://www.typescriptlang.org/docs/handbook/mixins.html). This is a way to dynamically extend a class such that it can be used to extend multiple types of classes.

Usually, mixins are defined as a function that takes in a base class and returns a new sub class that contains both sets of properties: mixin(base) => subClass. This is a powerful tool that allows for a single class to extend multiple classes by chaining mixins together.

```ts
class Base { base = 'base'; }
function AMixin(base) { return class A extends base { a = 'a'; } }
function BMixin(base) { return class B extends base { b = 'b'; } }
function CMixin(base) { return class C extends base { c = 'c'; } }

const base = Base;               // class { base: 'base' }
const a = AMixin(Base);          // class { base: 'base', a: 'a' }
const bc = BMixin(CMixin(Base)); // class { base: 'base', b: 'b', c: 'c' }
const abc = AMixin(bc);          // class { base: 'base', a: 'a', b: 'b', c: 'c' }

const a_obj = new a();
console.log(a_obj.base);  // 'base'
console.log(a_obj.a);     // 'a'
console.log(a_obj.b);     // undefined
console.log(a_obj.c);     // undefined

const bc_obj = new bc();
console.log(bc_obj.base); // 'base'
console.log(bc_obj.a);    // undefined
console.log(bc_obj.b);    // 'b'
console.log(bc_obj.c);    // 'c'
```

The cookbook uses mixers to expand on the `Gamegui` class without needing to worry about interfering with any framework code or changing game specific code.

```ts
import Gamegui = require('ebg/core/gamegui');
import CommonMixer = require("cookbook/common");

class YourGameName extends CommonMixer(Gamegui) {
	// ... <class code> ...
}
```

The cookbook also contains a module called `mixinmixer` which can be used to apply an array of mixin to a single class. This is purely for cleaner syntax when extending a larger number of mixins.

```ts
import mixinmixer = require("cookbook/mixinmixer");
const result = mixinmixer(Base, AMixin, BMixin, CMixin, ...);

// Equivalent to:
const result = AMixin(BMixin(CMixin(Base)));
```



## Cookbook

The cookbook contains common game mechanics and components. These recipes are pulled from the BGA documentation and other sources. If you want to use any of the cookbook recipes, simply include the file in your `tsconfig.json` file and import the module to wherever you need it:

```json
{
	"files": [
		"yourgamename.ts",
		"yourgamename.d.ts",
		// Add Cookbook files here: <generated-path>/node_modules/bga-ts-template/typescript/cookbook/<module>.ts
		"<generated-path>/node_modules/bga-ts-template/typescript/cookbook/<module>.ts"
	]
}
```
```ts
// yourgamename.ts
import "cookbook/<module>";

class YourGameName  {
	// ... class code ...
}
```

> Note: Recipes (or modules) with the exception of `common` are user defined and may not be fully tested.

A good portion of the cookbook recipes are mixins. See the [Mixin Modules](/docs/typescript/index.md#mixin-modules) section for more information.

### The `common` Cookbook Module

Using the common cookbook module is recommended as it contains function that are used in nearly every game, and wrappers for much more concise and type safe code. The two big functions in this module are:
- `ajaxAction`: Typed `ajaxcallWrapper` method recommended by the BGA wiki. This method removes obsolete parameters, simplifies action url, and auto adds the lock parameter to the args if needed. See JSDocs for more information.
- `subscribeNotif`: A typed dojo.subscribe wrapper for notifications. See JSDocs for more information.

```json
{
	"files": [
		"yourgamename.ts",
		"yourgamename.d.ts",
		"../../node_modules/bga-ts-template/typescript/cookbook/common.ts"
	]
}
```
```ts
import CommonMixer = require("cookbook/common");
```

### Explanation for Nerds

Typescript automatically ignores all node_modules from compilation unless they are explicitly included in the `tsconfig.json` file. Therefore, the files cannot be automatically compiled like code within the project.

Including the file to your tsconfig will add file as an AMD module in your output file:

```js
// Your game module:
define("bgagame/yourgamename", ["ebg/core/gamegui"], function (Gamegui) {
	...
});
// Included files, example 'common':
define("cookbook/common", ["ebg/core/gamegui"], function (Gamegui) {
	...
});
```

Doing this alone is not enough as the added modules are never loaded as nothing needs them as a dependency. The `import` statement is used to force the module to be loaded and executed before the current module is executed:

```ts
import CommonMixer = require("cookbook/common");
```
```js
// "cookbook/common" is now added as a dependency to your game
define("bgagame/yourgamename", ["ebg/core/gamegui", "cookbook/common"], function (Gamegui, CommonMixer) {
	...
});
define("cookbook/common", ["ebg/core/gamegui"], function (Gamegui) {
	...
});
```



## Existing Project Conversion

The steps to convert the existing project to typescript are **extremely simple**! There are two different options when converting: A. Use `dojo.declare` with an object (matches existing), or B. using typescript classes. Option B is suggested but can require quite a bit of syntax fixing because object templates are declared differently than classes.

1. **Follow all of the steps in the [Getting Started](/README.md#getting-started) section**. MAKE SURE TO BACKUP ALL FILES BEFORE RUNNING `npm run init`!

	> *Before deleting/overriding the template generated files, like `yourgamename.ts`, you should look at the structure and comments in the file. These provide great documentation for how the typescript project works.*


2. **Copy contents** of existing game file to `<source>/client/<yourgamename>.ts`. Your file should currently look like this:

	```js
	define([
		"dojo",
		"dojo/_base/declare",
		"ebg/core/gamegui",
		"ebg/counter",
		// <other dependencies>...
	],
	function (dojo, declare) {
		return declare("bgagame.___yourgamename___", ebg.core.gamegui, {
			// ... <class code> ...
		});
	});
	```

3. **Replace contents of `yourgamename.ts`** by matching it to the following format:

	**OPTION A:** `declare` w/ object

	*Using imports*
	```ts
	/// <amd-module name="bgagame/___yourgamename___"/>
	import dojo = require("dojo");
	import declare = require("dojo/_base/declare");
	import Gamegui = require('ebg/core/gamegui');
	import Counter = require('ebg/counter');
	// <other dependencies>...

	declare<Gamegui, object>( "bgagame.___yourgamename___", Gamegui, {
		// ... <class code> ...
	} );
	```

	*Using global variables, more closely matches original...*
	```ts
	// Only the loaded modules are included in the global namespace, so this is a totally valid way to use imports with 100% type safety

	/// <amd-module name="bgagame/___yourgamename___"/>
	import "dojo"; // Loads the dojo object using dojoConfig if needed
	import "dojo/_base/declare"; // Add 'declare' to dojo if needed
	import "ebg/core/gamegui"; // Loads Gamegui class onto ebg.core.gamegui if needed
	import "ebg/counter"; // Loads Counter class onto ebg.counter if needed
	// <other dependencies>...

	// 'InstanceType<typeof ebg.core.gamegui>' gets the type of object created from the 'ebg.core.gamegui' class.
	dojo.declare<InstanceType<typeof ebg.core.gamegui>, object>( "bgagame.___yourgamename___", ebg.core.gamegui, {
		// ... <class code> ...
	} );
	```

	The type `object` is used as a filler for the type of your game. You can replace this with a type to specify all of the properties on your object. *The type Gamegui is automatically mixed in with the `this` of the object.*

	```ts
	interface YourGameName {
		constructor: (args: any) => void;
		cardWidth: number;
		cardHeight: number;
		// ... <properties> ...
	}

	declare<Gamegui, YourGameName>( "bgagame.___yourgamename___", Gamegui, {
		// ... <class code> ...
	} );
	```

	**OPTION B:** Typescript classes

	```ts
	/// <amd-module name="bgagame/___yourgamename___"/>

	import dojo = require("dojo");
	import Gamegui = require('ebg/core/gamegui');
	import Counter = require('ebg/counter');
	// <other dependencies>...

	// Your <class code> will need some syntax fixing to match the class format
	class ___YourGameName___ extends Gamegui {
		// ... <class code> ...
	}

	dojo.setObject( "bgagame.___yourgamename___", ___YourGameName___ );
	```

4. **Fix type errors** so the code can compile. See the [Type Safety](/docs/typescript/index.md#type-safety) section for more information on how to reduce the strictness of typescript.

5. (optional) Replace the signatures of the five main methods (`setup`, `onEnteringState`, `onLeavingState`, `onUpdateActionButtons`, `setupNotifications`) with the `Gamegui` signatures. This will enable typechecking and intellisense on arguments for these methods.

**Continue to the [Configurations](/README.md#configurations) section** for more information on how to use the generated files, and rebuild the project whenever you make any changes.

## Type Safety

One of the amazing things about typescript is that nearly all type safety is optional. By default, this project sets up a strict type checking environment. This means that all types are checked, and all errors must be resolved before the project can be built. Usually, this is a good thing, but sometimes you know what you are doing and don't want to deal with type errors. There are a few catch all changes that can help a lot with minimizing the intrusive nature of typescript:

> Remember that all of these suggestions will reduce safety of the code. The goal is to find a balance between type safety and ease of use.

### Modifying the tsconfig

Changing the tsconfig to have less strict typechecking is always the first go to. Usually, most issues will be from implicit `any` types, which can be disabled with `noImplicitAny: false`.

```json
// tsconfig.json
{
	/* Preference. This defaults to the most strict ts rules. */
	"strict": true,
	"noImplicitReturns": true,
	"noFallthroughCasesInSwitch": true,
	"noUncheckedIndexedAccess": true,
	"noImplicitAny": false,
}
```

See all of the strictness options [here](https://www.typescriptlang.org/tsconfig#strict).

### Re-declaring Functions

Most functions are typed to always return the minimum grantee. This means that if a function will return all possible values rather the what you are expecting. This can be fixed by re-declaring the function to match whatever type safety you want.

```ts
// Error: Object is possibly 'null'.
// Error: Property 'onclick' does not exist on type 'Element'.
$('pick_NoTrump').onclick = // ...

// Fix. No more null returns, Element is now HTMLElement.
// NOTE: All null checks can be disabled with the tsconfig option: 'strictNullChecks: false'.
declare function $<T extends HTMLElement>(selector: string | T): T;
```

### Declaration Merging

Declaration merging is a powerful tool in typescript that allows you to modify existing types by re-declaring them with the same name on the global scope. There are several use cases for this, such as to avoid casting or type checks:

```ts
// Disable all buttons on an element...
for (let i = 0; i < element.children.length; i++) {
	let child = element.children[i];
	// Error: Property 'style' does not exist on type 'Element'.
	child.style.opacity = 0.5;
	// Error: Property 'disabled' does not exist on type 'Element'.
	child.disabled = true;
}

declare global { // A TS specific syntax to add types to a global namespace
	interface HTMLElement { // Use declaration merging to modify the HTMLElement interface
		// Fix: Make the children of HTMLElement always be HTMLElements.
		children: HTMLCollectionOf<HTMLElement>;
		// Fix: Add the 'disabled' property to all HTMLElements (so we don't have to cast to a button).
		disabled?: boolean;
	}
}
```

See more about declaration merging [here](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

## Advanced Nuances

There are a few small differences between writing typescript and pure javascript. Nearly all games will not need to worry about these, but they are listed here for completeness.

### this.inherited

The main way to call the parent class method when using `dojo.declare` is to use `this.inherited(arguments)`. This is a special method that is added to the class when using `dojo.declare`. This method is not added to the class when using typescript classes. Instead, you can use the `super` keyword to call the parent class method.

```ts
// dojo.declare
declare("bgagame.___yourgamename___", ebg.core.gamegui, {
	// ...
	method: function () {
		this.inherited(arguments);
	}
});

// Typescript
class ___YourGameName___ extends Gamegui {
	// ...
	method() {
		super.method();
	}
}
```