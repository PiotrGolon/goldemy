"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({
  disabled,
  courseId,
  isPublished: initialStatus,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(initialStatus);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const action = isPublished ? "unpublish" : "publish";
      const response = await axios.patch(`/api/courses/${courseId}/${action}`);

      if (response.status === 200) {
        setIsPublished(!isPublished);
        toast.success(
          `Rozdział ${isPublished ? "niepublikowany" : "opublikowany"}!`
        );
        if (!isPublished) {
          return confetti.onOpen();
        }
      } else {
        throw new Error("Błąd podczas zmiany stanu publikacji");
      }

      router.refresh();
    } catch {
      toast.error("Something wend wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Course deleted");
      router.refresh();
      router.push(`/teacher/courses`);
    } catch {
      toast.error("Somethingdsd went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
