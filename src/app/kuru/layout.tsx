import AdminAuthProxy from '@/components/admin/AdminAuthProxy';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProxy>{children}</AdminAuthProxy>;
}
