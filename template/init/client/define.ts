// @ts-nocheck
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * ___YourGameName___ implementation : © ___developer-names___ ___developer-emails___
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
/**
 * @file The entrypoint for the game. This is the only file that should be included in the typescript configuration. All other tiles will be included by the compiler through reference tags. This file should only contain one *.ts reference which should always be the file that defines the the game specific class as all files needed for compilation will be included by reference tags in that file, assuming no compilation errors.
 */
/// <reference path="___yourgamename___.ts" />

define([
	"dojo",
	"dojo/_base/declare",
	"ebg/core/gamegui",
	"ebg/counter",
],
function (_dojo, declare) {
	return declare("bgagame.___yourgamename___", ebg.core.gamegui, new ___YourGameName___());
});

/**
 * Adds type safety to the default define method specified by the Dojo Toolkit. For simplicity, this has been restricted to defining the game specific module, requiring the game to be defined as a class.
 * @param dependencies The dependencies required for the game class to be defined.
 * @param callback The function that will define the game class and return it.
 * - param `_dojo`: The dojo library. This should not be used but instead the global `dojo` object should be used.
 * - param `declare`: The declare function used to create the module.
 * - - param `module_name`: The name of the module to be defined. Should be 'bgagame.kiriaitheduel'.
 * - - param `base_class`: The target to define the module on. Should be `ebg.core.gamegui`.
 * - - param `module`: The game class to be defined. Should be a new instance of the game class: `new KiriaiTheDuel()`.
 * @example
 * define([
 * 	"dojo",
 * 	"dojo/_base/declare",
 * 	"ebg/core/gamegui",
 * 	"ebg/counter",
 * ],
 * function (dojo, declare) {
 * 	return declare("bgagame.kiriaitheduel", ebg.core.gamegui, new KiriaiTheDuel());
 * });
 */
declare const define: <T extends Gamegui>(
	dependencies: BGA_Dependency[],
	callback: (
		_dojo: null,
		declare: (
			module_name: string,
			base_class: new () => Gamegui,
			module: T) => T
	) => T
) => void;