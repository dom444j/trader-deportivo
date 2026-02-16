import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/shared/layout/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardShell role={session.user.role}>
      {children}
    </DashboardShell>
  );
}