"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@oss/ui/components/alert-dialog";
import { Button } from "@oss/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@oss/ui/components/dialog";
import { Input } from "@oss/ui/components/input";
import { Skeleton } from "@oss/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@oss/ui/components/table";
import { Textarea } from "@oss/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import type { ColumnDef } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export type Invoice = {
	nanoId: string;
	merchant: string;
	date: string;
	amount: string;
	currency: string;
	category: string;
	description: string;
	tax: string;
};

function EditDialog({
	invoice,
	onSave,
}: {
	invoice: Invoice;
	onSave: (nanoId: string, data: Partial<Invoice>) => Promise<void>;
}) {
	const [open, setOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			merchant: invoice.merchant,
			date: invoice.date.slice(0, 10),
			amount: invoice.amount,
			currency: invoice.currency,
			category: invoice.category,
			description: invoice.description,
			tax: invoice.tax,
		},
		onSubmit: async ({ value }) => {
			await onSave(invoice.nanoId, value);
			setOpen(false);
		},
	});

	return (
		<Dialog
			onOpenChange={(next) => {
				if (!next) {
					form.reset();
				}
				setOpen(next);
			}}
			open={open}
		>
			<DialogTrigger render={<Button size="sm" variant="outline" />}>
				Edit
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Invoice</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="grid gap-3 py-2">
						<div className="grid grid-cols-2 gap-3">
							<form.Field name="merchant">
								{(field) => (
									<div className="space-y-1">
										<label className="font-medium text-sm" htmlFor="merchant">
											Merchant
										</label>
										<Input
											id="merchant"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="date">
								{(field) => (
									<div className="space-y-1">
										<label className="font-medium text-sm" htmlFor="date">
											Date
										</label>
										<Input
											id="date"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="date"
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<form.Field name="amount">
								{(field) => (
									<div className="space-y-1">
										<label className="font-medium text-sm" htmlFor="amount">
											Amount
										</label>
										<Input
											id="amount"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="currency">
								{(field) => (
									<div className="space-y-1">
										<label className="font-medium text-sm" htmlFor="currency">
											Currency
										</label>
										<Input
											id="currency"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<form.Field name="tax">
								{(field) => (
									<div className="space-y-1">
										<label className="font-medium text-sm" htmlFor="tax">
											Tax
										</label>
										<Input
											id="tax"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="category">
								{(field) => (
									<div className="space-y-1">
										<label className="font-medium text-sm" htmlFor="category">
											Category
										</label>
										<Input
											id="category"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>
						</div>
						<form.Field name="description">
							{(field) => (
								<div className="space-y-1">
									<label className="font-medium text-sm" htmlFor="description">
										Description
									</label>
									<Textarea
										id="description"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={2}
										value={field.state.value}
									/>
								</div>
							)}
						</form.Field>
					</div>
					<DialogFooter>
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<Button disabled={isSubmitting} type="submit">
									{isSubmitting ? "Saving…" : "Save"}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function makeColumns(
	onEdit: (nanoId: string, data: Partial<Invoice>) => Promise<void>,
	onDelete: (nanoId: string) => Promise<void>
): ColumnDef<Invoice>[] {
	return [
		{ accessorKey: "merchant", header: "Merchant" },
		{
			accessorKey: "date",
			header: "Date",
			cell: ({ getValue }) => {
				const val = getValue() as string;
				return new Date(val).toLocaleDateString();
			},
		},
		{ accessorKey: "amount", header: "Amount" },
		{ accessorKey: "currency", header: "Currency" },
		{ accessorKey: "category", header: "Category" },
		{ accessorKey: "description", header: "Description" },
		{ accessorKey: "tax", header: "Tax" },
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const invoice = row.original;
				return (
					<div className="flex items-center gap-2">
						<EditDialog invoice={invoice} onSave={onEdit} />
						<AlertDialog>
							<AlertDialogTrigger
								render={<Button size="sm" variant="destructive" />}
							>
								Delete
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete invoice?</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently remove the invoice from{" "}
										<strong>{invoice.merchant}</strong>. This cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={() => onDelete(invoice.nanoId)}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				);
			},
		},
	];
}

type InvoiceTableProps = {
	invoices: Invoice[];
	loading: boolean;
	onDelete: (nanoId: string) => Promise<void>;
	onEdit: (nanoId: string, data: Partial<Invoice>) => Promise<void>;
};

export function InvoiceTable({
	invoices,
	loading,
	onEdit,
	onDelete,
}: InvoiceTableProps) {
	const columns = makeColumns(onEdit, onDelete);

	const table = useReactTable({
		data: invoices,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (loading) {
		return (
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((hg) => (
						<TableRow key={hg.id}>
							{hg.headers.map((h) => (
								<TableHead key={h.id}>
									{h.isPlaceholder
										? null
										: flexRender(h.column.columnDef.header, h.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length > 0 ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								className="h-24 text-center text-muted-foreground"
								colSpan={columns.length}
							>
								No invoices yet. Drop a file above to get started.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
