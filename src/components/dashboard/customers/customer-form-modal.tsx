"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { Field, FormActions, INPUT_CLASS } from "@/components/ui/form-field";
import { useCreateCustomer, useUpdateCustomer } from "@/lib/queries/customers.queries";
import { errorMessage } from "@/lib/api/types";
import { formatDateTime } from "@/lib/format";
import type { ConsentSource, Customer } from "@/lib/api/customers.types";

export const CONSENT_SOURCE_LABELS: Record<ConsentSource, string> = {
  manual: "Recorded manually",
  pos_signup: "POS sign-up",
  web_checkout: "Website checkout",
  whatsapp_chat: "WhatsApp chat",
};

const customerSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name"),
  lastName: z.string().trim(),
  phone: z.string().trim(),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]),
  address: z.string().trim(),
  note: z.string().trim(),
  consent: z.boolean(),
  consentSource: z.enum(["manual", "pos_signup", "web_checkout", "whatsapp_chat"]),
});

type CustomerForm = z.infer<typeof customerSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit this customer; omit to create a new one. */
  customer?: Customer | null;
};

export function CustomerFormModal({ open, onOpenChange, customer }: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={customer ? "Edit Customer" : "Add New Customer"}
      description={customer ? `Added ${formatDateTime(customer.createdAt)}` : undefined}
    >
      {open && <CustomerFormBody customer={customer ?? null} onClose={() => onOpenChange(false)} />}
    </Modal>
  );
}

function CustomerFormBody({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  const create = useCreateCustomer();
  const update = useUpdateCustomer();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      phone: customer?.phone ?? "",
      email: customer?.email ?? "",
      address: customer?.address ?? "",
      note: customer?.note ?? "",
      consent: !!customer?.consentGivenAt,
      consentSource: customer?.consentSource ?? "manual",
    },
  });
  const consent = useWatch({ control, name: "consent" });
  const hadConsent = !!customer?.consentGivenAt;

  const onSubmit = (data: CustomerForm) => {
    setFormError(null);
    const onError = (err: unknown) => setFormError(errorMessage(err));

    if (!customer) {
      create.mutate(
        {
          firstName: data.firstName,
          ...(data.lastName && { lastName: data.lastName }),
          ...(data.phone && { phone: data.phone }),
          ...(data.email && { email: data.email }),
          ...(data.address && { address: data.address }),
          ...(data.note && { note: data.note }),
          ...(data.consent && { consentGivenAt: new Date().toISOString(), consentSource: data.consentSource }),
        },
        {
          onSuccess: (c) => {
            toast.success(`${c.firstName} added`);
            onClose();
          },
          onError,
        },
      );
      return;
    }

    update.mutate(
      {
        id: customer.id,
        body: {
          firstName: data.firstName,
          lastName: data.lastName || null,
          phone: data.phone || null,
          email: data.email || null,
          address: data.address || null,
          note: data.note || null,
          // Keep the original consent timestamp; only record a new one when consent is newly given.
          ...(data.consent && !hadConsent && {
            consentGivenAt: new Date().toISOString(),
            consentSource: data.consentSource,
          }),
          ...(!data.consent && hadConsent && { consentGivenAt: null, consentSource: null }),
        },
      },
      {
        onSuccess: () => {
          toast.success("Customer updated");
          onClose();
        },
        onError,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name" htmlFor="customer-first" error={errors.firstName?.message}>
          <input id="customer-first" type="text" {...register("firstName")} className={INPUT_CLASS} />
        </Field>
        <Field label="Last name (optional)" htmlFor="customer-last">
          <input id="customer-last" type="text" {...register("lastName")} className={INPUT_CLASS} />
        </Field>
        <Field label="Phone (optional)" htmlFor="customer-phone">
          <input id="customer-phone" type="tel" placeholder="0803 123 4567" {...register("phone")} className={INPUT_CLASS} />
        </Field>
        <Field label="Email (optional)" htmlFor="customer-email" error={errors.email?.message}>
          <input id="customer-email" type="email" {...register("email")} className={INPUT_CLASS} />
        </Field>
      </div>
      <Field label="Address (optional)" htmlFor="customer-address">
        <input id="customer-address" type="text" {...register("address")} className={INPUT_CLASS} />
      </Field>
      <Field label="Note (optional)" htmlFor="customer-note">
        <textarea id="customer-note" rows={2} {...register("note")} className={INPUT_CLASS} />
      </Field>

      {/* NDPR consent is always explicit, never implied. */}
      <div className="rounded-lg bg-surface-container-low/60 p-3 flex flex-col gap-2">
        <label className="flex items-start gap-2 text-sm text-on-surface">
          <input type="checkbox" {...register("consent")} className="mt-0.5 accent-primary" />
          <span>Customer consented to us storing their details (NDPR)</span>
        </label>
        {hadConsent && consent ? (
          <p className="text-xs text-on-surface-variant pl-6">
            Recorded {formatDateTime(customer!.consentGivenAt)}
            {customer!.consentSource && ` · ${CONSENT_SOURCE_LABELS[customer!.consentSource]}`}
          </p>
        ) : consent ? (
          <div className="pl-6">
            <label htmlFor="customer-consent-source" className="sr-only">
              How consent was given
            </label>
            <select id="customer-consent-source" {...register("consentSource")} className={`${INPUT_CLASS} py-1.5`}>
              {Object.entries(CONSENT_SOURCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {formError && <p className="text-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{formError}</p>}

      <FormActions
        onCancel={onClose}
        submitLabel={customer ? "Save Changes" : "Add Customer"}
        isSubmitting={create.isPending || update.isPending}
      />
    </form>
  );
}
