"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { Field, FormActions, INPUT_CLASS } from "@/components/ui/form-field";
import { useCategories, useCreateProductWithVariant } from "@/lib/queries/products.queries";
import { errorMessage } from "@/lib/api/types";
import { nairaToKobo } from "@/lib/format";

const naira = (label: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || (Number.isInteger(nairaToKobo(v)) && nairaToKobo(v) >= 0), `Enter a valid ${label}`);

const productSchema = z.object({
  name: z.string().trim().min(1, "Enter a product name"),
  description: z.string().trim(),
  categoryId: z.string(),
  sku: z.string().trim().min(1, "Enter a SKU"),
  price: naira("price").refine((v) => v !== "", "Enter a selling price"),
  cost: naira("cost"),
  taxRate: z
    .string()
    .trim()
    .refine((v) => v === "" || (Number(v) >= 0 && Number(v) <= 100), "Enter a rate between 0 and 100"),
  openingStock: z
    .string()
    .trim()
    .refine((v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0), "Enter a whole number"),
});

type ProductForm = z.infer<typeof productSchema>;

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function CreateProductModal({ open, onOpenChange }: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Product"
      description="Prices are in Naira. You can add more variants later."
      width="max-w-xl"
    >
      {open && <CreateProductForm onClose={() => onOpenChange(false)} />}
    </Modal>
  );
}

function CreateProductForm({ onClose }: { onClose: () => void }) {
  const categories = useCategories();
  const create = useCreateProductWithVariant();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      sku: "",
      price: "",
      cost: "",
      taxRate: "",
      openingStock: "",
    },
  });

  const onSubmit = (data: ProductForm) => {
    setFormError(null);
    create.mutate(
      {
        product: {
          name: data.name,
          ...(data.description && { description: data.description }),
          ...(data.categoryId && { categoryId: data.categoryId }),
        },
        variant: {
          sku: data.sku,
          name: data.name,
          priceKobo: nairaToKobo(data.price),
          ...(data.cost && { costKobo: nairaToKobo(data.cost) }),
          // Percent → basis points (7.5% → 750).
          ...(data.taxRate && { taxRateBps: Math.round(Number(data.taxRate) * 100) }),
        },
        ...(data.openingStock && { openingStock: Number(data.openingStock) }),
      },
      {
        onSuccess: (product) => {
          toast.success(`${product.name} added`);
          onClose();
        },
        onError: (err) => setFormError(errorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Product name" htmlFor="product-name" error={errors.name?.message}>
        <input id="product-name" type="text" {...register("name")} className={INPUT_CLASS} />
      </Field>

      <Field label="Description (optional)" htmlFor="product-description">
        <textarea id="product-description" rows={2} {...register("description")} className={INPUT_CLASS} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category (optional)" htmlFor="product-category">
          <select id="product-category" {...register("categoryId")} className={INPUT_CLASS}>
            <option value="">No category</option>
            {(categories.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="SKU" htmlFor="product-sku" error={errors.sku?.message} hint="Must be unique">
          <input id="product-sku" type="text" autoCapitalize="characters" {...register("sku")} className={INPUT_CLASS} />
        </Field>

        <Field label="Selling price (₦)" htmlFor="product-price" error={errors.price?.message}>
          <input id="product-price" type="text" inputMode="decimal" {...register("price")} className={`${INPUT_CLASS} font-mono`} />
        </Field>

        <Field label="Cost price (₦, optional)" htmlFor="product-cost" error={errors.cost?.message}>
          <input id="product-cost" type="text" inputMode="decimal" {...register("cost")} className={`${INPUT_CLASS} font-mono`} />
        </Field>

        <Field label="VAT rate (%, optional)" htmlFor="product-tax" error={errors.taxRate?.message} hint="Nigeria standard VAT is 7.5">
          <input id="product-tax" type="text" inputMode="decimal" {...register("taxRate")} className={INPUT_CLASS} />
        </Field>

        <Field label="Opening stock (optional)" htmlFor="product-stock" error={errors.openingStock?.message}>
          <input id="product-stock" type="number" min={0} step={1} {...register("openingStock")} className={INPUT_CLASS} />
        </Field>
      </div>

      {formError && <p className="text-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{formError}</p>}

      <FormActions onCancel={onClose} submitLabel="Add Product" isSubmitting={create.isPending} />
    </form>
  );
}
