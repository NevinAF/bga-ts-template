const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const config = jsoncUtil.readObject('template.config.jsonc');

//#region Validate Configuration

let missingKeys = [];
if (config['yourgamename'] === "_TODO_") missingKeys.push('yourgamename');
if (config['bga-project-folder'] === "_TODO_/") missingKeys.push('bga-project-folder');
if (config['developer-names'] === "_TODO_") missingKeys.push('developer-names');
if (config['developer-emails'] === "_TODO_") missingKeys.push('developer-emails');

if (missingKeys.length > 0) {
	console.error("The following keys are not configured in the template.config.jsonc file: " + missingKeys.join(", "));
	process.exit(1);
}

if (!fs.existsSync(config["bga-project-folder"])) {
	console.error("The BGA project folder does not exist: " + config["bga-project-folder"]);
	process.exit(1);
}

// The folder relative to the bga-project-folder where the source files are located.
config["source-folder"] = path.relative(config["bga-project-folder"], path.resolve(__dirname, '../')).replace(/\\/g, '/');

//#endregion

const replacemap = {
	"YourGameName": config["yourgamename"],
	"yourgamename": config["yourgamename"].toLowerCase(),
	"bga-project-folder": config["bga-project-folder"],
	"source-folder": config["source-folder"],
	"php-version": config["php-version"],
	"bga-sharedcode":
		config["bga-sharedcode"] === true ? config["source-folder"] + "/template/server/" :
		config["bga-sharedcode"],
	"developer-names": config['developer-names'],
	"developer-emails": config['developer-emails'],
};

const keyRegex = new RegExp('___([a-zA-Z0-9-]+?)___', 'g');
const keyReplace = (content) => content.replace(keyRegex, (match, key) => replacemap[key] ?? match);

let replacequeue = [];

//#region Populate File Queue

if (fs.existsSync("template/build.js"))
	fs.unlinkSync("template/build.js");

replacequeue.push(["template/init/build.js", "template/build.js"]);

if (config["typescript-client"] === true) {
	replacequeue.push(['template/init/client/___yourgamename___.ts', 'client/___yourgamename___.ts']);
	replacequeue.push(['template/init/client/___yourgamename___.d.ts', 'client/___yourgamename___.d.ts']);
	replacequeue.push(['template/init/client/tsconfig.json', 'client/tsconfig.json']);
	replacequeue.push(['template/init/client/define.ts', 'client/define.ts']);
}

if (config["scss-client"] === true) {
	replacequeue.push(['template/init/client/___yourgamename___.scss', 'client/___yourgamename___.scss']);
}

for (const file of [
	"gameinfos.jsonc",
	"gameoptions.jsonc",
	"gamepreferences.jsonc",
	"gamestates.jsonc",
	"stats.jsonc"
]) if (config[file] === true)
	replacequeue.push(['template/init/shared/' + file, 'shared/' + file]);

//#endregion

//#region VS Code Settings
if (config["generate-vscode-files"] === true)
{
	const addKeys = (source, target, keys = null) =>
	{
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

	addKeys('template/init/vscode/php.json', config["bga-project-folder"] + '.vscode/php.json');
	addKeys('template/init/vscode/settings.json', config["bga-project-folder"] + '.vscode/settings.json');

	if (config["sftp-natizyskunk"])
		addKeys('template/init/vscode/sftp.json', config["bga-project-folder"] + '.vscode/sftp.json');
}
//#endregion

// #region Copy with Replacements
{
	// Create directories, and recursively get all files from directories added to this queue.
	for (let i = 0; i < replacequeue.length; i++)
	{
		let [source, target] = replacequeue[i];

		if (fs.lstatSync(source).isDirectory())
		{
			for (const file of fs.readdirSync(source))
				replacequeue.push([source + '/' + file, target + '/' + file]);
			replacequeue.splice(i, 1);
			i--;
		}
		else {
			// Replace any part of the file name
			target = keyReplace(target)
			replacequeue[i] = [source, target];

			// Create the directory if it doesn't exist.
			if (!fs.existsSync(target.substring(0, target.lastIndexOf('/'))))
				fs.mkdirSync(target.substring(0, target.lastIndexOf('/')), { recursive: true });
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
				if (config["gamestates.jsonc"] && source.endsWith("___yourgamename___.d.ts"))
				{
					let start = content.indexOf("	'-1': 'dummmy';");
					let end = content.indexOf("\n}", start);
					content = content.substring(0, start) + content.substring(end);
				}

				// Uncomment the schema line in the jsonc files
				if (source.endsWith(".jsonc"))
					content = content.replace('// "$schema": ', '"$schema": ');
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
		execSync(command + ' --version');
		return true;
	} catch (e) {
		return false;
	}
}

if (config["typescript-client"] === true || config["scss-client"] === true)
{
	// Check if npm or yarn is installed:
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

	if (config["typescript-client"] === true && !checkCommand('tsc'))
	{
		console.log("Installing typescript...");
		execSync('npm install typescript');
	}

	if (config["scss-client"] === true && !checkCommand('sass'))
	{
		console.log("Installing sass...");
		execSync('npm install sass');
	}
}
