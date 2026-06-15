import { notFound } from "next/navigation";
import { AdminApp } from "@/components/admin-app";
import { isAdminResource, resolveAdminResource } from "@/lib/admin-cms";

export const metadata = { title: "Admin" };

type Props = {
  params: Promise<{ resource: string }>;
};

export default async function AdminResourcePage({ params }: Props) {
  const { resource } = await params;

  if (!isAdminResource(resource) && !["site-settings", "products", "projects", "inquiries", "homepage-sections"].includes(resource)) {
    notFound();
  }

  return <AdminApp resource={resolveAdminResource(resource)} />;
}
