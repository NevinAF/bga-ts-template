# BGA Components

This directory contains the components (modules) that are defined under `eba/...`. Using any of these types requires that the module of the matching name is added as a dependency in the `define.ts` method. All modules with the exception of gamegui are names in the following format: `eba/<fileNameWithoutExtension>`. The gamegui module is `eba/core/gamegui` and should always be included as a dependency in all games (as this is the module that is being extended when creating a game).

```typescript
import module = require('eba/<fileNameWithoutExtension>');
// OR
import * as module from 'eba/<fileNameWithoutExtension>';
```