"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { Field, FormActions, INPUT_CLASS } from "@/components/ui/form-field";
import { useCategories, useCreateCategory } from "@/lib/queries/products.queries";
import { errorMessage } from "@/lib/api/types";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function CreateCategoryModal({ open, onOpenChange }: Props) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create Category">
      {open && <CreateCategoryForm onClose={() => onOpenChange(false)} />}
    </Modal>
  );
}

function CreateCategoryForm({ onClose }: { onClose: () => void }) {
  const categories = useCategories();
  const create = useCreateCategory();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Enter a category name.");
      return;
    }
    create.mutate(
      { name: name.trim(), ...(parentId && { parentId }) },
      {
        onSuccess: (category) => {
          toast.success(`Category "${category.name}" created`);
          onClose();
        },
        onError: (err) => setFormError(errorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Name" htmlFor="category-name">
        <input id="category-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
      </Field>
      {(categories.data?.length ?? 0) > 0 && (
        <Field label="Parent category (optional)" htmlFor="category-parent">
          <select id="category-parent" value={parentId} onChange={(e) => setParentId(e.target.value)} className={INPUT_CLASS}>
            <option value="">None</option>
            {categories.data!.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      {formError && <p className="text-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{formError}</p>}
      <FormActions onCancel={onClose} submitLabel="Create Category" isSubmitting={create.isPending} />
    </form>
  );
}
