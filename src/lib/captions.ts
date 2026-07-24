// Human-written captions for gallery photos, keyed by S3 object key.
// Photos not listed here fall back to a prettified filename, so entries
// are only needed where the filename isn't descriptive, e.g.:
//   "IMG_1913.jpeg": "Maggie's first day home",
const captions: Record<string, string> = {};

// Turns an S3 key like "sad_maggie Large.jpeg" into "Sad Maggie".
// The trailing "Large" is the size suffix Apple Photos adds on export.
const prettifyKey = (key: string): string => {
    const name = key
        .split("/").pop()!
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+(large|medium|small)$/i, "")
        .trim();
    return name.replace(/(^|\s)[a-z]/g, (letter) => letter.toUpperCase());
};

export const captionFor = (key: string): string => captions[key] ?? prettifyKey(key);
