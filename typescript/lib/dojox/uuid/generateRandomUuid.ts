import "./_base";

dojox.uuid.generateRandomUuid = function () {
	function random4byteHexStr() {
		for (
			var hexStr = Math.floor(
				(Math.random() % 1) * Math.pow(2, 32)
			).toString(16);
			hexStr.length < 8;

		)
			hexStr = "0" + hexStr;
		return hexStr;
	}
	var big = random4byteHexStr();
	var mid = random4byteHexStr();
	var lil  = random4byteHexStr();
	mid = mid.substring(0, 4) + "-4" + mid.substring(5, 8);
	lil = "8" + lil.substring(1, 4) + "-" + lil.substring(4, 8);
	return (`${big}-${mid}-${lil}${random4byteHexStr()}`).toLowerCase() as any;
};

declare global {
	namespace DojoJS
	{
		type UUID = `${string}-${string}-4${string}-8${string}-${string}`;

		interface Dojox_UUID
		{
			/**
			 * @returns A random UUID in the format xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx
			 */
			generateRandomUuid: () => UUID;
		}

		interface Dojox
		{
			uuid: Dojox_UUID;
		}
	}
}

export = dojox.uuid.generateRandomUuid;