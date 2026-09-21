export function Marca({ className = "" }: { className?: string }) {
  return <span className={`marca text-primary ${className}`}>muriqui</span>;
}

export function Assinatura({ className = "" }: { className?: string }) {
  return (
    <p className={`font-display text-sm text-muted-foreground italic ${className}`}>
      Lares <span className="not-italic underline underline-offset-4">únicos</span> para exploradores{" "}
      <span className="not-italic underline underline-offset-4">extraordinários.</span>
    </p>
  );
}
