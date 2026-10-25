import PeekShell from "@/components/peek/PeekShell";
import { getProjects } from "@/lib/content/projects";

/**
 * Wraps every intercepted /work/[slug]. Living one level above [slug] keeps the
 * shell mounted while prev/next swap the project, so the dialog doesn't re-open
 * (and re-animate) on each step and still knows what to refocus on close.
 */
export default function PeekLayout({ children }: LayoutProps<"/work">) {
  const order = getProjects().map(({ slug, title }) => ({ slug, title }));
  return <PeekShell projects={order}>{children}</PeekShell>;
}
