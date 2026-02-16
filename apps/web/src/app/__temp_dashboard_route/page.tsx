import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  // Redirigir según el rol del usuario
  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin');
    case 'TIPSTER':
      redirect('/tipster');
    case 'USER':
      redirect('/user');
    default:
      redirect('/login');
  }
}