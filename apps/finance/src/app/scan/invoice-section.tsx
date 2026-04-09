"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type Invoice, InvoiceTable } from "@/app/scan/invoice-table";
import { orpc } from "@/utils/orpc";
import { InvoiceDropZone } from "./invoice-drop-zone";

export function InvoiceSection() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchInvoices = useCallback(async () => {
		try {
			const data = await orpc.invoice.list();
			setInvoices(
				data.map((inv) => ({
					nanoId: inv.nanoId,
					merchant: inv.merchant,
					date:
						typeof inv.date === "string" ? inv.date : inv.date.toISOString(),
					amount: inv.amount,
					currency: inv.currency,
					category: inv.category,
					description: inv.description,
					tax: inv.tax,
				}))
			);
		} catch {
			toast.error("Failed to load invoices");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchInvoices();
	}, [fetchInvoices]);

	const handleEdit = useCallback(
		async (nanoId: string, data: Partial<Invoice>) => {
			try {
				await orpc.invoice.update({
					nanoId,
					data: {
						...(data.merchant !== undefined && { merchant: data.merchant }),
						...(data.date !== undefined && { date: new Date(data.date) }),
						...(data.amount !== undefined && { amount: data.amount }),
						...(data.currency !== undefined && { currency: data.currency }),
						...(data.category !== undefined && { category: data.category }),
						...(data.description !== undefined && {
							description: data.description,
						}),
						...(data.tax !== undefined && { tax: data.tax }),
					},
				});
				toast.success("Invoice updated");
				await fetchInvoices();
			} catch {
				toast.error("Failed to update invoice");
			}
		},
		[fetchInvoices]
	);

	const handleDelete = useCallback(
		async (nanoId: string) => {
			try {
				await orpc.invoice.delete({ nanoId });
				toast.success("Invoice deleted");
				await fetchInvoices();
			} catch {
				toast.error("Failed to delete invoice");
			}
		},
		[fetchInvoices]
	);

	return (
		<div className="space-y-6">
			<InvoiceDropZone onCreatedAction={fetchInvoices} />

			<section>
				<h2 className="mb-3 font-semibold text-lg">Recorded Invoices</h2>
				<InvoiceTable
					invoices={invoices}
					loading={loading}
					onDelete={handleDelete}
					onEdit={handleEdit}
				/>
			</section>
		</div>
	);
}
