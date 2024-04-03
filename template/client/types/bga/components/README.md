# BGA Components

This directory contains the components (modules) that are defined under `eba/...`. Using any of these types requires that the module of the matching name is added as a dependency in the `define.ts` method. All modules with the exception of gamegui are names in the following format: `eba/<fileNameWithoutExtension>`. The gamegui module is `eba/core/gamegui` and should always be included as a dependency in all games (as this is the module that is being extended when creating a game).

```typescript
/// <reference path="types/index.d.ts" />
/// <reference path="yourgamename.ts" />

define([
	"dojo",
	"dojo/_base/declare",
	"ebg/core/gamegui",
	// Add modules here...
	// "ebg/counter",
	// "ebg/stock",
	// "ebg/zone",
],
function (dojo, declare) {
	return declare("bgagame.yourgamename", ebg.core.gamegui, new YourGameName());
});
```