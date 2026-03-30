import { Parent } from "./form";

export default function InputExamplePage() {
  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="mb-2 font-bold text-2xl">Input Examples</h1>
      <p className="mb-6 text-muted-foreground">
        Demonstrates the <code>TextInput</code> component with form validation.
      </p>
      <Parent />
    </main>
  );
}
