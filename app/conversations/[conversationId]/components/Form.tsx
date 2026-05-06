'use client';

import useConversation from '@/app/hooks/useConversation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPhoto, HiPaperAirplane } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { getSocket } from '@/app/lib/socket';
import { api } from '@/app/lib/api';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const Form = () => {
  const {user} = useAuth()
  const { conversationId } = useConversation();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { message: '' },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.message.trim()) return;
    console.log(user)
    const socket = getSocket(user?._id!);
    socket?.emit('sendMessage', {
      room_id: conversationId,
      content: data.message,
      attachments: [],
    });
    setValue('message', '', { shouldValidate: false });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const res = await api.post('/files/upload', formData);
      const attachments = res.data.urls;
      console.log(user);
      const socket = getSocket(user?._id!);
      socket?.emit('sendMessage', {
        room_id: conversationId,
        content: '',
        attachments,
      });
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <label className="cursor-pointer">
        <HiPhoto size={30} className="text-cyan-500" />
        <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
      </label>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-cyan-500 cursor-pointer hover:bg-cyan-600 transition"
        >
          <HiPaperAirplane size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};
export default Form;