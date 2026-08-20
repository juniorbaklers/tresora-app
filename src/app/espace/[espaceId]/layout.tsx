import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { getEspace } from "@/lib/data";

export default async function EspaceLayout(props: LayoutProps<"/espace/[espaceId]">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return <AppShell espace={espace}>{props.children}</AppShell>;
}
