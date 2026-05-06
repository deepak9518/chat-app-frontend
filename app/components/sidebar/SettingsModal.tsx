"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../input/Input";
import Image from "next/image";
import Button from "../Button";
import { User } from "@/app/types";
import { api } from "@/app/lib/api";

interface SettingsModalProps {
  currentUser: User;
  isOpen?: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name || "",
      avatar: currentUser?.avatar || "",
    },
  });

  const image = watch("avatar");


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("files", file);

      const res = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploaded = res.data?.urls?.[0];

      if (!uploaded?.url) {
        throw new Error("Upload failed");
      }

      setValue("avatar", uploaded.url, {
        shouldValidate: true,
      });

      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      await api.patch("/users/profile", data);

      toast.success("Profile updated");
      router.refresh();
      onClose();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-10">
          <div className="border-b pb-8">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your profile details
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                register={register}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Photo
                </label>

                <div className="mt-3 flex items-center gap-4">
                  <Image
                    width={56}
                    height={56}
                    src={image || "/images/avatar.jpg"}
                    alt="avatar"
                    className="rounded-full object-cover"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    secondary
                    disabled={isLoading}
                    onClick={() => fileRef.current?.click()}
                  >
                    {isLoading ? "Uploading..." : "Change"}
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button disabled={isLoading} onClick={onClose} secondary>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
