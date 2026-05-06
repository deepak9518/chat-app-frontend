import Sidebar from '../components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';
import { Metadata } from 'next';
import getRooms from '../actions/getRooms';
import getUsers from '../actions/getUsers';

export const metadata: Metadata = {
  title: 'My Conversations | ChatFlow - Your Ultimate Chat Experience',
};

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rooms = await getRooms();
  const users = await getUsers();

  return (
      <main className="h-full flex justify-between start">
        <ConversationList initialRooms={rooms} users={users} />
        {children}
      </main>
  );
}