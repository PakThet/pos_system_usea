'use client'
import AdminLayout from "@/components/admin-layout";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    const router = useRouter();
    return <AdminLayout>{children}</AdminLayout>
}