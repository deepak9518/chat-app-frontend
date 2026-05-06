"use client";

import Modal from "@/app/components/Modal";
import Input from "@/app/components/input/Input";
import Select from "@/app/components/input/Select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import { User } from "@/app/types";
import { api } from "@/app/lib/api";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddEmail = () => {
    if (!emailInput) return;

    if (!isValidEmail(emailInput)) {
      toast.error("Invalid email");
      return;
    }

    if (inviteEmails.includes(emailInput)) {
      toast.error("Email already added");
      return;
    }

    setInviteEmails((prev) => [...prev, emailInput]);
    setEmailInput("");
  };

  const handleRemoveEmail = (email: string) => {
    setInviteEmails((prev) => prev.filter((e) => e !== email));
  };

  const copyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied!");
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      const res = await api.post("/rooms", {
        name: data.name,
        type: "group",
        members: data.members.map((m: any) => m.value),
        inviteEmails,
      });

      const roomId = res.data._id;

      const inviteLink = `${window.location.origin}/invite/${res.data.inviteCode}`;
      alert(`Invite Link for ${inviteEmails} : ${inviteLink}`);

      router.push(`/conversations/${roomId}`);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-10">
          <div className="border-b pb-8">
            <h2 className="text-lg font-semibold">Create a group chat</h2>

            <div className="mt-6 flex flex-col gap-6">
              <Input
                label="Group name"
                id="name"
                register={register}
                errors={errors}
                disabled={isLoading}
                required
              />

              <Select
                disabled={isLoading}
                label="Select members"
                options={users.map((user) => ({
                  label: user.name || user.email,
                  value: user._id,
                }))}
                onChange={(value) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />

              <div>
                <label className="text-sm font-medium">Invite by email</label>

                <div className="flex gap-2 mt-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 border px-3 py-2 rounded focus:outline-none"
                    placeholder="Enter email"
                  />

                  <Button type="button" onClick={handleAddEmail} secondary>
                    Add
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {inviteEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      {email}
                      <span
                        onClick={() => handleRemoveEmail(email)}
                        className="cursor-pointer text-red-500"
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {inviteLink && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <p className="text-sm mb-2">Invite link:</p>
                  <div className="flex gap-2">
                    <input
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <Button type="button" onClick={copyLink} secondary>
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              disabled={isLoading}
              onClick={onClose}
              type="button"
              secondary
            >
              Cancel
            </Button>

            <Button disabled={isLoading} type="submit">
              Create
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
