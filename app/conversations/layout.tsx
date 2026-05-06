import Sidebar from '../components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Conversations | ChatFlow - Your Ultimate Chat Experience',
};

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="h-full flex justify-between start">
        <ConversationList />
        {children}
      </main>
  );
}