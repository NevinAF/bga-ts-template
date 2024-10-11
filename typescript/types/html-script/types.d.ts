/** Utility type which converts a union of object types to an intersection of object types. This allows for all possible properties to be accessible on a type without needing to do any casting. */
type AnyOf<T> = (T extends {} ? (x: T) => any : never) extends (x: infer R) => void ? R : never;
/** Utility type which returns all keys of an object type that have a value type of ValueType. */
type KeysWithType<T, ValueType> = {
    [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T];
/** Utility type that uses the default type, D, when the supplied type, T, is 'never' */
type Default<T, D = any> = [T] extends [never] ? D : T;
type Falsy = false | 0 | "" | null | undefined;
type Constructor<T> = {
    new (...args: any[]): T;
    prototype: T;
};
type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : [];
type Length<T extends any[]> = T['length'];
type Push<T extends any[], E> = [...T, E];
type Skip<T extends any[], N extends number, I extends any[] = []> = Length<I> extends N ? T : Skip<Tail<T>, N, Push<I, any>>;
/**
 * Unions each index of two tuples:
 * A = [string, number, boolean]
 * B = [number, number, object, string]
 * UnionTuple<A, B> = [string | number, number, boolean | object, string]
 */
type UnionTuple<A extends any[], B extends any[]> = [
    ...{
        [K in keyof A]: A[K] | (K extends keyof B ? B[K] : never);
    },
    ...Skip<B, Length<A>>
];
type throws<T extends Error> = never;
type HexChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type InferHexColor<T extends string = string> = T extends `#${HexChar}${HexChar}${HexChar}${infer Rest1}` ? (Rest1 extends `` ? T : (Rest1 extends `${HexChar}${HexChar}${HexChar}` ? T : never)) : never;
type HexString = string;
/** A utility type for defining inline types using the interface or 'typeof' format. */
type Type<T> = T;
/** Defines a fixed length array. */
type Buffer<T, N extends number, Append extends unknown[] = []> = Append['length'] extends N ? Append : Buffer<T, N, [T, ...Append]>;
declare namespace BGA {
    type ID = number | `${number}`;
    type LanguageCode = 'ar' | 'be' | 'bg' | 'br' | 'ca' | 'cs' | 'da' | 'de' | 'el' | 'en' | 'es' | 'et' | 'fa' | 'fi' | 'fr' | 'gl' | 'he' | 'hi' | 'hr' | 'hu' | 'id' | 'it' | 'ja' | 'ko' | 'lt' | 'lv' | 'ms' | 'nb' | 'nl' | 'pt' | 'pl' | 'ro' | 'ru' | 'sk' | 'sl' | 'sr' | 'sv' | 'th' | 'tr' | 'uk' | 'vi' | 'zh-cn' | 'zh';
    /** Partial: This has been partially typed based on a subset of the BGA source code. */
    interface PlayerMetadata {
        user_id: BGA.ID;
        status: 'online' | 'offline' | string;
        device: 'desktop' | 'mobile' | string;
        language: LanguageCode;
        player_name: string;
        grade: BGA.ID;
        rank: BGA.ID;
        karma: BGA.ID;
        country: "US" | string;
        city: string | null;
        avatar: string | "000000";
        tutorial_seen: HexString;
        /** 0 = Female, 1 == Male, other = neutral. */
        gender: '0' | '1' | 'other' | null;
        is_premium: '0' | '1';
        is_beginner: '0' | '1';
        languages: {
            [code in LanguageCode]?: LanguageMetadata<code>;
        };
        country_infos: {
            name: "United States of America" | string;
            cur: "USD" | string;
            code: "US" | string;
            flag_x: number;
            flag_y: number;
        };
    }
    /** Partial: This has been partially typed based on a subset of the BGA source code. */
    interface LanguageMetadata<T = LanguageCode> {
        id: T;
        level: 0 | 1;
    }
    /**
     * An interface representing the base structure of a deck item (usually a card). This matches the structure of the php component `deck` and the `deck` table in the database. Note that all properties will be passed as string from the server but JS is able to automatically convert to the correct type without needing to parse the integer values.
     * @see {@link https://en.doc.boardgamearena.com/Deck | PHP Deck Component} for more information.
     */
    interface DeckItem {
        /** The unique identifier of the deck item. int(10) unsigned NOT NULL, primary key. */
        id: number;
        /** The type of the deck item. The meaning of this is game specific, however, 'deck' is always where the cards are created, and 'hand' is always where card go when drawn, and 'discard' is used for `autoreshuffle`. varchar(16) NOT NULL. */
        location: string;
        /** The location of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
        location_arg: number;
        /** The type of the deck item. The meaning of this is game specific. varchar(16) NOT NULL. */
        type: string;
        /** The type argument of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
        type_arg: number;
    }
}
//# sourceMappingURL=types.d.ts.map