import e = require("./_base/lang");
import t = require("./dom");
import n = require("./io-query");
import r = require("./json");

class DomForm {
	private static o(t: Record<string, any>, n: string, r: any) {
		if (null !== r) {
			var o = t[n];
			"string" == typeof o
				? (t[n] = [o, r])
				: e.isArray(o)
				? o.push(r)
				: (t[n] = r);
		}
	}

	/**
	 * Serialize a form field to a JavaScript object.
	 */
	fieldToObject(e: HTMLInputElement | string): any[] | string | null {
		var n: any[] | string | null = null;
		if ((e = t.byId(e)!)) {
			var r = e.name,
				o = (e.type || "").toLowerCase();
			if (r && o && !e.disabled)
				if ("radio" == o || "checkbox" == o)
					e.checked && (n = e.value);
				else if (e.multiple) {
					n = [];
					for (var i = [e.firstChild]; i.length; )
						for (
							var a = i.pop();
							a;
							a = a.nextSibling
						) {
							if (
								1 != a.nodeType ||
								"option" != (a as Element).tagName.toLowerCase()
							) {
								a.nextSibling &&
									i.push(a.nextSibling);
								a.firstChild &&
									i.push(a.firstChild);
								break;
							}
							(a as any).selected && n.push((a as any).value);
						}
				} else n = e.value;
		}
		return n;
	}

	/**
	 * Serialize a form node to a JavaScript object.
	 */
	toObject(formOrID: HTMLFormElement | string): Record<string, any> {
		for (
			var n: Record<string, any> = {},
				r = t.byId(formOrID)!.elements,
				a = 0,
				s = r.length;
			a < s;
			++a
		) {
			var u = r[a] as HTMLInputElement,
				c = u.name,
				l = (u.type || "").toLowerCase();
			if (
				c &&
				l &&
				"file|submit|image|reset|button".indexOf(l) <
					0 &&
				!u.disabled
			) {
				DomForm.o(n, c, this.fieldToObject(u));
				if ("image" == l)
					n[c + ".x"] = n[c + ".y"] = n[c].x = n[c].y = 0;
			}
		}
		return n;
	}

	/**
	 * Returns a URL-encoded string representing the form passed as either a
	 * node or string ID identifying the form to serialize
	 */
	toQuery(formOrId: HTMLFormElement | string): string {
		return n.objectToQuery(this.toObject(formOrId));
	}

	/**
	 * Create a serialized JSON string from a form node or string
	 * ID identifying the form to serialize
	 */
	toJson(formOrId: HTMLFormElement | string, prettyPrint?: boolean): string {
		return r.stringify(this.toObject(formOrId), null, prettyPrint ? 4 : 0);
	}
}

export = new DomForm();