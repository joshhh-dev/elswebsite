// Client-side image compression → base64 data URI.
//
// Alternative to Firebase Storage while it isn't enabled yet for this
// project: images are resized/compressed in the browser and stored directly
// as a data URI string inside the post's Firestore document. Firestore caps
// a whole document at 1MiB, so this only works for reasonably small,
// compressed images — fine for a handful of announcement graphics, not a
// full photo gallery. Swap this out for real Storage uploads later without
// changing the block data shape (`{ type: "image", url, caption }` — a
// data URI and a Storage download URL are both just strings).

export function compressImageToDataUrl(file, { maxWidth = 1200, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read the image."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Rough safety ceiling per image so a post (which can have several blocks)
// stays comfortably under Firestore's 1MiB per-document limit.
export const MAX_DATA_URL_BYTES = 700_000;
