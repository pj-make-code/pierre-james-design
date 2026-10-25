// A soft navigation to any other page must clear the peek slot; without this
// match the modal would stay open on top of the new page (Next.js parallel routes).
export default function CatchAll() {
  return null;
}
