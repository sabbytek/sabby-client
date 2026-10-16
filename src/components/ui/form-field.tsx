export const INPUT_CLASS =
  "w-full text-sm px-3 py-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary disabled:opacity-60";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-on-surface mb-1.5">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}

type FormActionsProps = {
  onCancel: () => void;
  submitLabel: string;
  isSubmitting: boolean;
};

export function FormActions({ onCancel, submitLabel, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-medium text-on-surface px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
