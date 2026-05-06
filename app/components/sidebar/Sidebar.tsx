'use client';
import { useAuth } from '@/app/context/AuthContext';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

function Sidebar({ children }: { children: React.ReactNode }) {
  const {user} = useAuth();

  return (
    <div className=" h-full">
      <DesktopSidebar currentUser={user!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
