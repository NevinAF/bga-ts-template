//#region Imports and Utilities

const fs = require('fs');
const { exec, execSync } = require('child_process');

function exitWithError(message, ...optionalParams) {
	console.error(...arguments);
	process.exit(1);
}

if (!fs.existsSync("___bga-project-folder___")) {
	console.error("The BGA project folder does not exist: ___bga-project-folder___. Either re-initialize the project with a valid folder or create the folder.");
	process.exit(1);
}

const jsoncUtil = {
	/** Removes comments and trailing commas from the jsonc formatted string. */
	stringToJson: function (jsonc) {
		let result = jsonc.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
		result = result.replace(/,(\s*[\]}])/g, '$1');
		result = result.replace(/"\$schema": ".*",?/g, '');
		result = result.replace(/^\s*[\r\n]/gm, '');
		return result;
	},
	readObject: (file) => {
		try { return JSON.parse(jsoncUtil.stringToJson(fs.readFileSync(file, 'utf8'))) }
		catch (err) {
			exitWithError(`File ${file} is not a valid JSON file: ${err}`);
		}
	},
}

const builder = {
	watch: process.argv.includes('--watch') ?
		(file, callback) => {
			try { fs.watch(file, { encoding: 'buffer' }, callback) }
			catch (err) { }
		} : null,
	commands: [],
	watchCommand: (message, watchfile, callback) => builder.commands.push({
		message: message,
		callback: () => {
			callback();
			if (watchfile && builder.watch)
				builder.watch(watchfile, (eventType, filename) => {
					console.log(`${watchfile} changed. ` + message + '...');
					callback();
				});
		}
	}),
	execCommand: (message, command) => builder.commands.push({
		message: message,
		callback: () => {
			if (builder.watch)
				exec(command, { stdio: 'inherit' });
			else {
				try { execSync(command, { stdio: 'inherit' }); }
				catch (err) {
					console.error(err.message);
					process.exit(1);
				}
			}
		}
	})
};

//#endregion

//#region JSON Writer

const writer = {
	typescript_type_properties: new Set(['argsType', 'typescriptType']),
	php_translated_properties: new Set(['description', 'descriptionmyturn']),
	translateFunc: 'clienttranslate',
	indent: 0,
	inTSProperty: 0,
	fileSignature:
`/**
 * THIS FILE HAS BEEN AUTOMATICALLY GENERATED. ANY CHANGES MADE DIRECTLY MAY BE OVERWRITTEN.
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * ___YourGameName___ implementation : © ___developer-names___ ___developer-emails___
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
`,
	write: (stream, obj, isPHP) => {
		const type = typeof obj;
		switch (type) {
			case 'object':
				if (obj === null) {
					stream.write('null');
					break;
				}
				// If this is an array:
				if (Array.isArray(obj)) {
					stream.write('[');
					for (let i = 0; i < obj.length; i++) {
						writer.write(stream, obj[i], isPHP);
						if (i < obj.length - 1) {
							stream.write(', ');
						}
					}
					stream.write(']');
					break;
				}

				if (Object.entries(obj).length === 0) {
					stream.write(isPHP ? 'array()' : '{}');
					break;
				}
	
				stream.write(isPHP ? 'array(\n' : '{\n');
				writer.indent++;
				for (const key in obj) {
					// if is parsable as int
					if (writer.php_translated_properties.has(key) && obj[key] !== '' && isPHP) {
						stream.write('\t'.repeat(writer.indent));
						stream.write(`'${key}' => ${writer.translateFunc}('${obj[key]}'),\n`);
					}
					else {
						if (writer.typescript_type_properties.has(key))
							writer.inTSProperty++;
						
						if (writer.inTSProperty == 0 || !isPHP)
						{
							stream.write('\t'.repeat(writer.indent));
							if (!isNaN(parseInt(key))) {
								stream.write(isPHP ? `${key} => ` : `${key}: `);
							} else {
								stream.write(isPHP ? `'${key}' => ` : `'${key}': `);
							}
							
							writer.write(stream, obj[key], isPHP);
							stream.write(',\n');
						}
	
						if (writer.typescript_type_properties.has(key))
							writer.inTSProperty--;
					}
				}
				writer.indent--;
				stream.write('\t'.repeat(writer.indent));
				stream.write(isPHP ? ')' : '}');
	
				break;
			case 'string':
				// stringify with single quotes:
				let jsonString = JSON.stringify(obj);
				jsonString = jsonString.substring(1, jsonString.length - 1);
				if (writer.inTSProperty > 0)
					stream.write(jsonString);
				else {
					stream.write(`'${jsonString.replace(/'/g, "\\'").replace(/\\"/g, '"')}'`);
				}
				break;
			case 'number':
				stream.write(obj.toString());
				break;
			case 'boolean':
				stream.write(obj ? 'true' : 'false');
				break;
			case 'undefined':
				console.error(`Value type of 'undefined' should not be printing to json/php file. This is likely an internal error.`);
				stream.write('undefined');
				break;
			default:
				console.error(`Unsupported value type in json/php file: ${type}. Value: ${obj}`);
				stream.write(obj?.toString() ?? 'null');
				break;
		}
	}
}

//#endregion

const dtsBuildFiles = [ "../../template/client/types/index.d.ts"];

//#region Game States
if (fs.existsSync('shared/gamestates.jsonc'))
{
	builder.watchCommand("Game States: 'gamestates.jsonc' => 'states.inc.php', '.action.php', [gamestates.d.ts]", 'shared/gamestates.jsonc', () => {
		if (!fs.existsSync('shared/gamestates.jsonc')) {
			console.error('File not found: shared/gamestates.jsonc.');
		}

		let statesJSON = jsoncUtil.readObject('shared/gamestates.jsonc');

		// #region Validate+Autofill

		Set.prototype.tryAdd = function (value) {
			let length = this.size;
			this.add(value);
			return length !== this.size;
		}

		const stateIds = new Set();
		// Check for duplicate state ids and names. Also make sure the game end and start states are present.
		{
			const stateNames = new Set();
			const hasEndState = false;
			for (const key in statesJSON) {
				const state = statesJSON[key];

				if (!stateIds.tryAdd(key))
					exitWithError(`Multiple states have the same id: ${key}. States: ${Object.entries(statesJSON).filter(([k, v]) => k === key).map(([k, v]) => v.name).join(', ')}`);

				if (state.name === undefined)
					exitWithError(`State ${key} does not have a name.`);

				if (!stateNames.tryAdd(state.name))
					exitWithError(`Multiple states have the same name: ${state.name}. States: ${Object.entries(statesJSON).filter(([k, v]) => v.name === state.name).map(([k, v]) => k + ` (${v})`).join(', ')}`);

				if (state.action === 'stGameEnd' && hasEndState) {
					exitWithError('There are multiple Game End states: ' + Object.entries(statesJSON).filter(([k, v]) => v.action === 'stGameEnd').map(([k, v]) => k + ` (${v.name})`).join(', '));
				}

				if (state.action === 'stGameSetup' && key !== '1') {
					exitWithError('There is a state with the action stGameSetup but does not have the id 1: ' + key + ` (${state.name})`);
				}
			}

			// Make sure there is a game start and game end state
			if (!stateIds.has('1'))
				exitWithError('There is no Game Setup state with id 1.');
		}


		// Make sure that only the stGameSetup and stGameEnd actions are typed as manager. Also, make sure all 'game' and 'manager' states have an action.
		for (const key in statesJSON) {
			const state = statesJSON[key];
			if (state.type === 'manager')
			{
				if (state.action !== 'stGameSetup' && state.action !== 'stGameEnd') {
					exitWithError(`State ${key} ("${state.name}") is typed as 'manager' but is not the Game Setup or Game End state.`);
				}
				if (state.action === 'stGameSetup' && key !== '1') {
					exitWithError(`State ${key} ("${state.name}") is typed as 'manager' and is the Game Setup state, but does not have the id 1.`);
				}
			}
			else if (state.type === 'game') {
				if (!state.action)
					exitWithError(`State ${key} ("${state.name}") is typed as 'game' but does not have an action.`);
			}
			else if (state.type === undefined) {
				exitWithError(`State ${key} ("${state.name}") does not have a type.`);
			}
			else if (state.type !== 'multipleactiveplayer' && state.type !== 'activeplayer') {
				exitWithError(`State ${key} ("${state.name}") does not have a valid type: ${state.type}.`);
			}
		}

		// Check if description/descriptionmyturn is set when the state type is not 'game':
		for (const key in statesJSON) {
			const state = statesJSON[key];

			if (!state.description) {
				if (state.type !== 'game' && state.type !== 'manager') {
					exitWithError(`State ${key} ("${state.name}") is not of type 'game' nor 'manager' and does not have a description. If this is intended, set the description to an empty string.`);
				}
				state.description = '';
			}
			else state.description = state.description.toString();
			if (!state.descriptionmyturn) {
				if (state.type !== 'game' && state.type !== 'manager') {
					exitWithError(`State ${key} ("${state.name}") is not of type 'game' nor 'manager' and does not have a descriptionmyturn. If this is intended, set the descriptionmyturn to an empty string.`);
				}
			}
		}

		// Validate that all transitions are unique and have a valid target state id
		for (const key in statesJSON) {
			const state = statesJSON[key];
			const transitions = state.transitions;

			if (!transitions) {
				if (state.action !== 'stGameEnd')
					exitWithError(`State ${key} ("${state.name}") does not have any transitions. This is only ever valid on the Game End state.`);
				continue;
			}

			if (typeof transitions !== 'object')
				exitWithError(`Transitions in state ${key} ("${state.name}") is not an object.`);

			const transitionNames = new Set();
			for (const transition in transitions) {
				if (transitionNames.has(transition)) {
					exitWithError(`Transition named "${transition}" is duplicated in state ${key} ("${state.name}").`);
				}
				transitionNames.add(transition);

				if (!stateIds.has(transitions[transition].toString())) {
					exitWithError(`Transition named "${transition}" in state ${key} ("${state.name}") points to a non-existing state id ${transitions[transition]}. State Ids: ${Array.from(stateIds).map(id => `${id} (${statesJSON[id].name})`).join(', ')}`);
				}
			}

			if (transitionNames.size === 0) {
				exitWithError(`State ${key} ("${state.name}") has no transitions. This is not valid and only the End game state should have no transitions defined (not an empty object).`);
			}
		}

		// Validate that all possible actions are unique and if they share a name with another states possible actions, their values are the same.
		const possibleActions = new Map();
		for (const key in statesJSON) {
			const state = statesJSON[key];
			const actions = state.possibleactions;

			if (!actions) {
				if (state.type !== 'game' && state.type !== 'manager')
					exitWithError(`State ${key} ("${state.name}") does not have any possibleactions. This is only ever valid on states with type 'game' or 'manager'.`);
				continue;
			}

			if (typeof actions !== 'object')
				exitWithError(`Possible actions in state ${key} ("${state.name}") is not an object. When defining states a jsonc file, the actions are keys of an object, with the value being an (ordered) array of parameters the client needs to send.`);

			for (const action in actions) {
				if (!possibleActions.has(action)) {
					possibleActions.set(action, actions[action]);
				} else if (possibleActions.get(action) !== actions[action]) {
					exitWithError(`Action named "${action}" in state ${key} ("${state.name}") has a different value than the same action name in another state.`);
				}

				if (!Array.isArray(actions[action]))
					exitWithError(`Possible action "${action}" in state ${key} ("${state.name}") is not an object. When defining states a jsonc file, the actions are keys of an object, with the value being an (ordered) array of parameters the client needs to send.`);

				let counter = 0;
				for (const parameter of actions[action]) {
					counter++;

					if (parameter.name === undefined || typeof parameter.name !== 'string') {
						exitWithError(`Parameter number ${counter} in action ${action} in state ${key} ("${state.name}") does not have a name (or it is not a string).`);
					}

					if (parameter.type === 'AT_enum') {
						if (!parameter.argTypeDetails) {
							exitWithError(`Action ${action} in state ${key} ("${state.name}") has a parameter with type 'AT_enum' but no argTypeDetails.`);
						}
					}
					else if (parameter.argTypeDetails) {
						exitWithError(`Action ${action} in state ${key} ("${state.name}") has argTypeDetails but is not of type 'AT_enum'.`);
					}
					else if (parameter.type === undefined) {
						exitWithError(`Parameter number ${counter} (${parameter.name}) in ${action} in state ${key} ("${state.name}") has a parameter without a type.`);
					}
				}
			}
		}

		// Add typescriptTypes to all possibleaction parameters:
		for (const key in statesJSON) {
			const state = statesJSON[key];
			const actions = state.possibleactions;

			if (!actions) continue;

			for (const action in actions) {
				let parameters = actions[action];

				for (let parameter of parameters) {
					if (parameter["typescriptType"]) {
						if (parameter.type == 'AT_enum')
							exitWithError(`Action ${action} in state ${key} ("${state.name}") has a parameter with type 'AT_enum'. Enums are listed using argTypeDetails and is automatically converted to typescript string literal union.`);
						continue;
					}

					switch (parameter.type) {
						case "AT_int":
						case "AT_posint":
						case "AT_float":
							parameter["typescriptType"] = "number";
							break;
						case "AT_email":
							parameter["typescriptType"] = "`${string}@${string}.${string}";
							break;
						case "AT_bool":
							parameter["typescriptType"] = "boolean";
							break;
						case "AT_enum":
							parameter["typescriptType"] = Array.from(new Set(parameter.argTypeDetails.map(e => `'${e}'`))).join(' | ');
							break;
						case "AT_login":
						case "AT_url":
						case "AT_alphanum":
						case "AT_username":
						case "AT_numberlist":
						case "AT_uuid":
						case "AT_version":
						case "AT_cityname":
						case "AT_filename":
						case "AT_groupname":
						case "AT_timezone":
						case "AT_mediawikipage":
						case "AT_html_id":
						case "AT_alphanum_dash":
						case "AT_date":
						case "AT_num":
						case "AT_alpha_strict":
						case "AT_namewithaccent":
						case "AT_json":
						case "AT_base64":
							parameter["typescriptType"] = "string";
							break;
						default:
							exitWithError(`Unknown parameter type: ${parameter.type}`);
							break;
					}
				}
			}
		}

		// Validate that all defined 'initialprivate' are on type 'multipleactiveplayer' states and target states which are 'private'
		for (const key in statesJSON) {
			const state = statesJSON[key];
			const initialprivate = state.initialprivate;

			if (initialprivate) {
				if (state.type !== 'multipleactiveplayer')
					exitWithError(`State ${key} ("${state.name}") has initialprivate defined but is not of type 'multipleactiveplayer'.`);
				
				for (const target of initialprivate) {
					if (!statesJSON[target])
						exitWithError(`State ${key} ("${state.name}") has initialprivate ${target}, but that state does not exist.`);

					if (statesJSON[target].type !== 'private')
						exitWithError(`State ${key} ("${state.name}") has an initialprivate target ${target} which is not of type 'private'.`);
				}
			}
		}

		//#endregion

		// #region Write .d.ts

		if (fs.existsSync('./client/tsconfig.json'))
		{
			dtsBuildFiles.push('gamestates.d.ts');
			if (!fs.existsSync("'client/build/"))
				fs.mkdirSync('client/build/', { recursive: true });

			const d_ts_stream = fs.createWriteStream('client/build/gamestates.d.ts');
			d_ts_stream.write(writer.fileSignature + 'interface GameStates ');
			writer.write(d_ts_stream, statesJSON, false);

			d_ts_stream.write(`

type PullActionArgs<T extends readonly any[]> = T extends [] ? {} : AnyOf<{
	[arg in TupleIndices<T>]: {
		[argName in T[arg]['name']]: T[arg]['typescriptType']
	}
}[TupleIndices<T>]>;

interface PlayerActions extends AnyOf<{
	[K in keyof GameStates]:
		GameStates[K] extends { possibleactions: { [key: string]: any[] } } ?
		{
			[action in keyof GameStates[K]['possibleactions']]:
				PullActionArgs<GameStates[K]['possibleactions'][action]>
		} : {}
}[keyof GameStates]> {}`);

			for (const key in statesJSON) {
				if (statesJSON[key].possibleactions) {
					statesJSON[key].possibleactions = Object.keys(statesJSON[key].possibleactions);
				}
			}
			d_ts_stream.close();
		}

		//#endregion

		// #region Write states.inc.php

		const statesphp_stream = fs.createWriteStream('___bga-project-folder___states.inc.php');
		statesphp_stream.write(
`<?php
declare(strict_types=1);
${writer.fileSignature}
/**
 * TYPE CHECKING ONLY, this function is never called.
 * If there are any undefined function errors here, you MUST rename the action within the game states file, or create the function in the game class.
 * If the function does not match the parameters correctly, you are either calling an invalid function, or you have incorrectly added parameters to a state function.
 */
if (false) {
	/** @var kiriaitheduel $game */
	${Object.values(statesJSON)
		.filter(state => state.action !== undefined && state.type !== 'manager')
		.map(state => `$game->${state.action}();`)
		.join('\n\t')
	}
}

$machinestates = `
);
		writer.write(statesphp_stream, statesJSON, true);
		statesphp_stream.write(';');
		statesphp_stream.close();

		// #endregion

		// #region Write .action.php
		const actionphp_stream = fs.createWriteStream('___bga-project-folder______yourgamename___.action.php');
		actionphp_stream.write(
`<?php
${writer.fileSignature}
class action____yourgamename___ extends APP_GameAction
{
	/** @var ___yourgamename___ $game */
	protected $game; // Enforces functions exist on Table class

	// Constructor: please do not modify
	public function __default()
	{
		if (self::isArg('notifwindow')) {
			$this->view = "common_notifwindow";
			$this->viewArgs['table'] = self::getArg("table", AT_posint, true);
		} else {
			$this->view = "___yourgamename_______yourgamename___";
			self::trace("Complete reinitialization of board game");
		}
	}`);

		for (const [name, parameters] of possibleActions) {
			actionphp_stream.write(`

	public function ${name}() {
		self::setAjaxMode();\n`);

			let callArgs = [];
			for (const parameter of parameters) {
				const phpType =
					parameter.type === 'AT_float' ? 'float' :
					parameter.type === 'AT_int' ? 'int' :
					parameter.type === 'AT_posint' ? 'int' :
					parameter.type === 'AT_bool' ? 'bool' :
					'string';
				actionphp_stream.write(`\n\t\t/** @var ${phpType} $${parameter.name} */\n`);

				actionphp_stream.write(`\t\t$${parameter.name} = self::getArg('${parameter.name}', ${parameter.type}`);

				if (parameter.mandatory === undefined || parameter.mandatory === true)
					actionphp_stream.write(', true');
				else actionphp_stream.write(', false');

				if (parameter.argTypeDetails) {
					actionphp_stream.write(', ');
					writer.write(actionphp_stream, parameter.argTypeDetails, true);
				}
				else if (parameter.bCanFail === true) {
					actionphp_stream.write(', array()');
				}

				if (parameter.bCanFail === true) {
					actionphp_stream.write(', true');
				}

				actionphp_stream.write(`);`);

				callArgs.push("$" + parameter.name);
			}

			if (parameters.length > 0)
				actionphp_stream.write('\n');

			actionphp_stream.write(`
		$this->game->${name}( ${callArgs.join(', ')} );

		self::ajaxResponse();
	}`);
		}

		actionphp_stream.write(`
}`);
		actionphp_stream.close();

		// #endregion
	});
}
//#endregion

//#region JSONC->JSON
{
	const jsoncToJson = (message, source, target) => {
		if (!fs.existsSync(source)) {
			return;
		}
		builder.watchCommand(message, source, () => fs.writeFileSync(target, jsoncUtil.stringToJson(fs.readFileSync(source, 'utf8'))));
	};

	if (fs.existsSync('./shared/stats.jsonc'))
		jsoncToJson("Game Statistics: stats.jsonc => stats.json", './shared/stats.jsonc', '___bga-project-folder___stats.json');
	if (fs.existsSync('./shared/gameoptions.jsonc'))
		jsoncToJson("Game Options: gameoptions.jsonc => gameoptions.json", './shared/gameoptions.jsonc', '___bga-project-folder___gameoptions.json');
	if (fs.existsSync('./shared/gamepreferences.jsonc'))
		jsoncToJson("Game Preferences: gamepreferences.jsonc => gamepreferences.json", './shared/gamepreferences.jsonc', '___bga-project-folder___gamepreferences.json');
}
//#endregion

//#region Game Infos
if (fs.existsSync('./shared/gameinfos.jsonc'))
{
	builder.watchCommand("Game Infos: gameinfos.jsonc => gameinfos.inc.php", './shared/gameinfos.jsonc', () => {
		const gameinfos = jsoncUtil.readObject('./shared/gameinfos.jsonc');
		const stream = fs.createWriteStream('___bga-project-folder___gameinfos.inc.php');

		writer.translateFunc = "totranslate";
		stream.write(`<?php\n$gameinfos = `);
		writer.write(stream, gameinfos, true);
		stream.write(';');
		stream.close();
	});
}
//#endregion

//#region client/build/index.d.ts

if (fs.existsSync('./client/tsconfig.json'))
{
	builder.commands.push({
		message: "Create Typescript Build Index: client/build/index.d.ts",
		callback: () => {
			const stream = fs.createWriteStream('client/build/index.d.ts');
			stream.write(writer.fileSignature + dtsBuildFiles.map(file => `/// <reference path="${file}" />`).join('\n'));
			stream.close();
		}
	});
}

//#region Compilers

if (fs.existsSync('./client/tsconfig.json')) {
	builder.execCommand(`Typescript compiler: client/define.ts => ___yourgamename___.js`, 'tsc -p client' + (builder.watch ? ' -w' : ''));
}

if (fs.existsSync('./client/___yourgamename___.scss')) {
	builder.execCommand(`SCSS compiler: client/___yourgamename___.scss => ___yourgamename___.css`, `sass --no-source-map client/___yourgamename___.scss ___bga-project-folder______yourgamename___.css` + (builder.watch ? ' --watch' : ''));
}

//#endregion


// #region Run!

console.log('Running build commands:');
for (const command of builder.commands) {
	console.log("\t" + command.message);
	command.callback();
}

if (!builder.watch)
	console.log('Build complete.');
else {
	setTimeout(() => {
		console.log('Press Ctrl+C to stop watching. Watching for changes...');
	}, 1000);
}