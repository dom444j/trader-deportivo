import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/shared/layout/DashboardShell';
import '@/styles/app.css';
import '@/styles/globals.css';
import '@/styles/variables.css';

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