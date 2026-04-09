import { Wireframe } from "@oss/ui/components/wireframe";
import { InvoiceSection } from "@/app/invoice-section";
import { Navbar } from "@/components/navigation";

export default function InvoicePage() {
	return (
		<Wireframe>
			<Navbar />
			<main className="mx-auto max-w-5xl px-4 py-8">
				<div className="mb-6">
					<h1 className="font-bold text-2xl">Invoice Expense Tracker</h1>
					<p className="mt-1 text-muted-foreground text-sm">
						Drop PDF or image invoices to extract and record expenses.
					</p>
				</div>

				<InvoiceSection />
			</main>
		</Wireframe>
	);
}
