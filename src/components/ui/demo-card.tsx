export function DemoCard() {
  return (
    <div className="p-6 border border-border rounded-md bg-background">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Token Validation
      </h2>
      <p className="text-sm mb-4">
        If you see purple accents, borders, and proper spacing, tokens are wired correctly.
      </p>
      <div className="flex gap-3 mb-4">
        <button className="px-4 py-2 bg-accent text-white rounded-sm hover:bg-accent-hover">
          Primary Button
        </button>
        <button className="px-4 py-2 border border-border text-foreground rounded-sm hover:bg-accent-light">
          Secondary Button
        </button>
      </div>
      <div className="flex gap-2">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-success-bg text-success rounded-full">
          Success
        </span>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-warning-bg text-warning rounded-full">
          Warning
        </span>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-danger-bg text-danger rounded-full">
          Danger
        </span>
      </div>
    </div>
  );
}
