import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  // Server-side authentication check
  const user = await getCurrentUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // If not logged in, show landing page
  return <LandingPage />;
}
