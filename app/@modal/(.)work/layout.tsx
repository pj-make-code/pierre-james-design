import PeekShell from "@/components/peek/PeekShell";
import { getProjects } from "@/lib/content/projects";

/**
 * Wraps every intercepted /work/[slug]. Living one level above [slug] keeps the
 * shell mounted while prev/next swap the project, so the dialog doesn't re-open
 * (and re-animate) on each step and still knows what to refocus on close.
 */
export default function PeekLayout({ children }: LayoutProps<"/work">) {
  // Just what the shell needs to rebuild the database's filtered order.
  const order = getProjects().map(({ slug, title, tags, type, sortDate }) => ({
    slug,
    title,
    tags,
    type,
    sortDate,
  }));
  return <PeekShell projects={order}>{children}</PeekShell>;
}
