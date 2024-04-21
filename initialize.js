const fs = require('fs');
const path = require('path');
let { execSync } = require('child_process');

const _execSync = execSync;
execSync = (command) => {
	try { _execSync(command, { stdio: 'inherit' }); }
	catch (e) { console.error(e.message); process.exit(1); }
};

const jsoncUtil = {
	/** Removes comments and trailing commas from the jsonc formatted string. */
	stringToJson: function (jsonc) {
		let result = jsonc.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
		result = result.replace(/,(\s*[\]}])/g, '$1');
		result = result.replace(/"\$schema": ".*",?/g, '');
		return result;
	},
	readObject: (file) => {
		try { return JSON.parse(jsoncUtil.stringToJson(fs.readFileSync(file, 'utf8'))) }
		catch (err) {
			console.error(`File ${file} is not a valid JSON file: ${err}`);
			process.exit(1);
		}
	},
}

const usage = `
Usage: npx bga-init <YourGameName> <developers> [source-folder] [...options]

Arguments:
	<YourGameName>: The upper camel case (pascal case) name of the game. This should exactly match what you used to create the game on BGA studio.
		Example: "YourGameName", "HeartsTutorial"
	<developers>: String used to populate the header of all generated files. This should contain names and emails.
		Example: "John Doe johndoe@gmail.com, Bob Smith thebuilder@cox.net".
	[source-folder]: The folder where the source files are located relative to the BGA project folder. If not specified, the source folder will be 'source'.
	[...options]:
		--typescript: A 'client' folder will be created in the source folder of this project, populated with 'yourgamename.ts', 'yourgamename.d.ts', and 'tsconfig'. As long as their exists a tsconfig in this client folder, the typescript compiler will be run on build.
		--scss: A 'client' folder will be created in the source folder of this project, populated with 'yourgamename.scss'. As long as there exists a 'yourgamename.scss' file in this client folder, the sass compiler will be run on build.
		--vscode-extension-pack: Additional settings linking json schemas, php include files, and updated sftp settings will be added to the .vscode folder of the BGA project. This should only be included if you are using vscode as your editor and have installed the extensions from the "BGA Extension Pack".
		--php-8.2: If specified, php version 8.2.17 will be used for project files. Otherwise, php version 7.4.33 will be used. (currently only for vscode settings)

		--gameinfos.jsonc: The 'gameinfos.inc.php' file will be generated using the <source>/shared/gameinfos.jsonc file.
		--gameoptions.jsonc: The 'gameoptions.json' file will be generated using the <source>/shared/gameoptions.jsonc file.
		--gamepreferences.jsonc: The 'gamepreferences.json' file will be generated using the <source>/shared/gamepreferences.jsonc file.
		--stats.jsonc: The 'stats.json' file will be generated using the <source>/shared/stats.jsonc file.
		--gamestates.jsonc: The 'states.inc.php' and 'action.php' files will be generated using the <source>/shared/gamestates.jsonc file. This:
			1) Automatically sets up the action.php to parse player actions.
			2) Creates type validation for function names used in all states (action+possibleactions),
			3) If --typescript, generates the type files for player actions and gamestates for intellisense and quick error correction.
`;

// load the config based on the cmd arguments

let config = {};
let argc = 2;

// Print help if requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
	console.log(usage);
	process.exit(0);
}

// Check if there are enough arguments
if (process.argv.length < 4) {
	console.error("There are not enough arguments. You must always specify at least two program arguments:", usage);
	process.exit(1);
}

config.YourGameName = process.argv[argc++];
// The the game name is not an alphanumeric string in pascal case, then it is invalid.
if (config.YourGameName.match(/[^a-zA-Z0-9]/) || config.YourGameName[0] !== config.YourGameName[0].toUpperCase()) {
	console.error("The game name must be an alphanumeric string in pascal case (upper camel case).", usage);
	process.exit(1);
}

if (config.YourGameName === "YourGameName") {
	console.error("You must specify the game name.", usage);
	process.exit(1);
}

config.developers = process.argv[argc++];

if (config.developers === "developers") {
	console.error("You must specify the developers.", usage);
	process.exit(1);
}

if (process.argv.length > argc && !process.argv[argc].startsWith("--")) {
	config.source = process.argv[argc++].replace(/\\/g, '/');
	if (!config.source.endsWith('/')) config.source += '/';

	if (config.source.includes("/node_modules/")) {
		console.error("The source folder cannot be in the node_modules folder.", usage);
		process.exit(1);
	}
}
else config.source = "./source/";

// Parse the options

for (; argc < process.argv.length; argc++) {
	switch (process.argv[argc]) {
		case "--typescript": config.typescript = true; break;
		case "--scss": config.scss = true; break;
		case "--vscode-extension-pack": config.vscode = true; break;
		case "--gameinfos.jsonc": config.gameinfos = true; break;
		case "--gameoptions.jsonc": config.gameoptions = true; break;
		case "--gamepreferences.jsonc": config.gamepreferences = true; break;
		case "--stats.jsonc": config.stats = true; break;
		case "--gamestates.jsonc": config.gamestates = true; break;
		case "--php-8.2": config.php8 = true; break;
		default:
			console.error("Unknown option: " + process.argv[argc], usage);
			process.exit(1);
	}
}

console.log(config);

// try to create the source folder and rollback if it fails.
try {
	fs.mkdirSync(config.source, { recursive: true });
}
catch (e) {
	console.error("The source folder could not be created: " + e, usage);
	process.exit(1);
}

//#endregion

const replacemap = {
	"YourGameName": config.YourGameName,
	"yourgamename": config.YourGameName.toLowerCase(),
	"source-folder": config.source,
	"php-version": config.php8 ? "8.2.17" : "7.4.33",
	"developers": config.developers,
	"source-to-project": path.relative(config.source, process.cwd()).replace(/\\/g, '/'),
	"source-to-template": path.relative(config.source, __dirname).replace(/\\/g, '/'),
};

const keyRegex = new RegExp('___([a-zA-Z0-9-]+?)___', 'g');
const keyReplace = (content) => content.replace(keyRegex, (match, key) => replacemap[key] ?? match);

let replacequeue = [];

//#region Populate File Queue

if (fs.existsSync(__dirname + "/build.js"))
	fs.unlinkSync(__dirname + "/build.js");

replacequeue.push(["init/build.js", __dirname + "/build.js"]);

if (config.typescript === true) {
	replacequeue.push(['init/client/___yourgamename___.ts', config.source + 'client/___yourgamename___.ts']);
	replacequeue.push(['init/client/___yourgamename___.d.ts', config.source + 'client/___yourgamename___.d.ts']);
	replacequeue.push(['init/client/tsconfig.json', config.source + 'client/tsconfig.json']);
}

if (config.scss === true) {
	replacequeue.push(['init/client/___yourgamename___.scss', config.source + 'client/___yourgamename___.scss']);
}

for (const file of [
	"gameinfos",
	"gameoptions",
	"gamepreferences",
	"gamestates",
	"stats"
]) if (config[file] === true)
	replacequeue.push(['init/shared/' + file + ".jsonc", config.source + 'shared/' + file + ".jsonc"]);

replacequeue.push(['init/gitignore', '.gitignore']);


//#endregion

//#region VS Code Settings
if (config.vscode === true)
{
	const addKeys = (source, target, keys = null) =>
	{
		source = __dirname + "/" + source;
		const sourceObj = JSON.parse(keyReplace(jsoncUtil.stringToJson(fs.readFileSync(source, 'utf8'))));
		
		
		let targetObj;
		if (fs.existsSync(target))
		{
			keys = keys || Object.keys(sourceObj);
			try { targetObj = jsoncUtil.readObject(target); }
			catch (e) {
				console.error("The file " + source + " is not a valid JSONC file.");
				return;
			}

			for (const key of keys)
			{
				if (!targetObj[key])
					targetObj[key] = sourceObj[key];
				else if (Array.isArray(targetObj[key]))
				{
					for (const item of sourceObj[key])
						if (targetObj[key].findIndex(x => JSON.stringify(x) === JSON.stringify(item)) === -1)
							targetObj[key].push(item);
				}
				else if (typeof targetObj[key] === 'object')
				{
					for (const subkey in sourceObj[key])
						if (!targetObj[key][subkey])
							targetObj[key][subkey] = sourceObj[key][subkey];
				}
			}
		}
		else targetObj = keys ?
			keys.reduce((acc, key) => { acc[key] = sourceObj[key]; return acc; }, {}) :
			sourceObj;

		if (!fs.existsSync(target.substring(0, target.lastIndexOf('/'))))
			fs.mkdirSync(target.substring(0, target.lastIndexOf('/')), { recursive: true });
		fs.writeFileSync(target, JSON.stringify(targetObj, null, '\t'));
	}

	addKeys('init/vscode/php.json', '.vscode/php.json');
	addKeys('init/vscode/settings.json', '.vscode/settings.json');
	addKeys('init/vscode/sftp.json', '.vscode/sftp.json');
}
//#endregion

//#region Copy Game Infos

const copyGameInfos = (content) =>
{
	function replaceBookendQuotes(str) {
		if (str[0] === "'" && str[str.length - 1] === "'")
			return '"' + str.substring(1, str.length - 1) + '"';
		return str;
	}

	const original = fs.readFileSync('gameinfos.inc.php', 'utf8');
	// <start-line><whitespace>'property'<whitespace>=><whitespace><data><whitespace>,<whitespace><end-line>
	const matches = original.matchAll(/^[ \t]*'([^']+)'[ \t]*=>[ \t]*([^\n]+?),?[ \t]*$/gm);
	
	for (const match of matches)
	{
		const key = match[1];

		const prop = `"${key}": `;
		let start = content.indexOf(prop);
		if (start === -1) continue;
		start += prop.length;

		let end = content.indexOf('\n', start);
		if (end === -1) continue;
		while (content[end - 1] === ',' || content[end - 1] === '\r')
			end -= 1;

		let value = replaceBookendQuotes(match[2].trim());
		if (value.startsWith('array('))
		{
			if (!value.endsWith(')'))
				continue;
			value = "[" + value.substring(6, value.length - 1).split(',').map(x => replaceBookendQuotes(x.trim())).join(', ') + "]";
		}
		else if (value.startsWith('['))
		{
			if (!value.endsWith(']'))
				continue;
			value = "[" + value.substring(1, value.length - 1).split(',').map(x => replaceBookendQuotes(x.trim())).join(', ') + "]";
		}

		content = content.substring(0, start) + value + content.substring(end);
	}

	return content;
}
//#endregion

// #region Copy with Replacements
{
	// Create directories, and recursively get all files from directories added to this queue.
	for (let i = 0; i < replacequeue.length; i++)
	{
		let [source, target] = replacequeue[i];
		source = __dirname + "/" + source;
		target = keyReplace(target);

		if (fs.lstatSync(source).isDirectory())
		{
			for (const file of fs.readdirSync(source))
				replacequeue.push([source + '/' + file, target + '/' + file]);
			replacequeue.splice(i, 1);
			i--;
		}
		else {
			replacequeue[i] = [source, target];

			// Create the directory if it doesn't exist.
			let index = target.lastIndexOf('/');
			if (index !== -1)
			{
				let folder = target.substring(0, index);
				if (!fs.existsSync(folder))
					fs.mkdirSync(folder, { recursive: true });
			}
		}
	}

	// Copy files and replace keys in the content.
	console.log("Copying files...");
	for (const [source, target] of replacequeue)
	{
		try {
			if (fs.existsSync(target)) {
				console.log("\t" + target + ": already exists (skipped).");
				continue;
			}

			let content =  keyReplace(fs.readFileSync(source, 'utf8'));

			// Special rules:
			{
				// Remove the ts-ignore/ts-nocheck comments from the typescript files (which prevent errors from within the init folder).
				if (content.startsWith("// @ts-"))
					content = content.substring(content.indexOf('\n') + 1);

				// Remove the default game states if the gamestates should be generated.
				if (config.gamestates && source.endsWith("___yourgamename___.d.ts"))
				{
					let start = content.indexOf("\n		'-1': 'dummmy';");
					let end = content.indexOf("\n\t}", start);
					content = content.substring(0, start) + content.substring(end);
				}

				// Uncomment the schema line in the jsonc files
				if (source.endsWith(".jsonc"))
				{
					content = content.replace('// "$schema": ', '"$schema": ');

					if (source.endsWith("gameinfos.jsonc")) {
						try {
							content = copyGameInfos(content);
						}
						catch (e) {
							console.warn("\t-Unable to copy data from existing gameinfos.inc.php.");
						}
					}
				}
				else {
					// TODO: Copy other jsonc file data...
				}
			}

			fs.writeFileSync(target, content);
			console.log("\t" + target + ": DONE!.");
		}
		catch (e) { console.error(source + " -> " + target, e); }
	}
}
//#endregion

//#region Install build commands

const checkCommand = (command) => {
	try {
		_execSync(command + ' --version');
		return true;
	} catch (e) {
		return false;
	}
}

let packageManager;
if (checkCommand('npm'))
	packageManager = "npm";
else if (checkCommand('yarn'))
	packageManager = "yarn";
else
{
	console.log("npm and yarn are not installed. Installing npm...");
	execSync('npm install -g npm');
}


if (config.typescript === true && !checkCommand('npx tsc'))
{
	console.log("Installing typescript...");
	execSync(packageManager + ' install typescript');
}

if (config.scss === true && !checkCommand('npx sass'))
{
	console.log("Installing sass...");
	execSync(packageManager + ' install sass');
}


// Run the build script
// npx bga-build
console.log("Running build script...");
execSync((packageManager === "npm" ? "npx" : "yarn run") + ' bga-build');