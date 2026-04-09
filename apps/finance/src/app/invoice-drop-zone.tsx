"use client";

import { Button } from "@oss/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@oss/ui/components/dialog";
import { Input } from "@oss/ui/components/input";
import { Textarea } from "@oss/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp";
const ACCEPTED_MIME_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/webp",
];

type ExtractedValues = {
	merchant: string;
	date: string;
	amount: string;
	currency: string;
	category: string;
	description: string;
	tax: string;
};

type InvoiceDropZoneProps = {
	onCreated: () => Promise<void>;
};

function ReviewDialogContent({
	defaultValues,
	onCreated,
	onClose,
}: {
	defaultValues: ExtractedValues;
	onCreated: () => Promise<void>;
	onClose: () => void;
}) {
	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			try {
				await orpc.invoice.create({
					merchant: value.merchant,
					date: new Date(value.date),
					amount: value.amount,
					currency: value.currency,
					category: value.category,
					description: value.description,
					tax: value.tax,
				});
				toast.success("Invoice saved");
				onClose();
				await onCreated();
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : "Failed to save invoice"
				);
				throw err;
			}
		},
	});

	return (
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
								<label className="font-medium text-sm" htmlFor="rv-merchant">
									Merchant
								</label>
								<Input
									id="rv-merchant"
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
								<label className="font-medium text-sm" htmlFor="rv-date">
									Date
								</label>
								<Input
									id="rv-date"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="date"
									value={field.state.value.slice(0, 10)}
								/>
							</div>
						)}
					</form.Field>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<form.Field name="amount">
						{(field) => (
							<div className="space-y-1">
								<label className="font-medium text-sm" htmlFor="rv-amount">
									Amount
								</label>
								<Input
									id="rv-amount"
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
								<label className="font-medium text-sm" htmlFor="rv-currency">
									Currency
								</label>
								<Input
									id="rv-currency"
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
								<label className="font-medium text-sm" htmlFor="rv-tax">
									Tax
								</label>
								<Input
									id="rv-tax"
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
								<label className="font-medium text-sm" htmlFor="rv-category">
									Category
								</label>
								<Input
									id="rv-category"
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
							<label className="font-medium text-sm" htmlFor="rv-description">
								Description
							</label>
							<Textarea
								id="rv-description"
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
							{isSubmitting ? "Saving…" : "Save Invoice"}
						</Button>
					)}
				</form.Subscribe>
			</DialogFooter>
		</form>
	);
}

export function InvoiceDropZone({ onCreated }: InvoiceDropZoneProps) {
	const [dragging, setDragging] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [review, setReview] = useState<ExtractedValues | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function processFile(file: File) {
		if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
			toast.error("Unsupported file type. Accepted: PDF, JPG, PNG, WEBP.");
			return;
		}
		setProcessing(true);
		try {
			const arrayBuffer = await file.arrayBuffer();
			const bytes = new Uint8Array(arrayBuffer);
			let binary = "";
			for (let i = 0; i < bytes.byteLength; i++) {
				const tt = bytes[i];
				if (tt === undefined) {
					toast.error("Failed to read file bytes");
				} else {
					binary += String.fromCharCode(tt);
				}
			}
			const fileBase64 = btoa(binary);
			const extracted = await orpc.invoice.extract({
				fileBase64,
				mimeType: file.type,
			});
			setReview(extracted);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to process file"
			);
		} finally {
			setProcessing(false);
		}
	}

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault();
		setDragging(true);
	}

	function handleDragLeave() {
		setDragging(false);
	}

	async function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			await processFile(file);
		}
	}

	async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			await processFile(file);
		}
		// Reset so the same file can be dropped again
		e.target.value = "";
	}

	return (
		<>
			{/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: drop zone requires drag events on container */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone requires drag events on container */}
			<section
				className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors ${
					dragging
						? "border-primary bg-primary/5"
						: "border-muted-foreground/30 bg-muted/20"
				}`}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				{processing ? (
					<p className="text-muted-foreground text-sm">Processing file…</p>
				) : (
					<>
						<p className="text-muted-foreground text-sm">
							Drag and drop a PDF or image here
						</p>
						<span className="text-muted-foreground text-xs">or</span>
						<Button
							onClick={() => fileInputRef.current?.click()}
							size="sm"
							type="button"
							variant="outline"
						>
							Choose file
						</Button>
					</>
				)}
				<input
					accept={ACCEPTED_EXTENSIONS}
					className="hidden"
					onChange={handleFileInput}
					ref={fileInputRef}
					type="file"
				/>
			</section>

			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						setReview(null);
					}
				}}
				open={review !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Review Extracted Invoice</DialogTitle>
					</DialogHeader>
					{review && (
						<ReviewDialogContent
							defaultValues={review}
							key={JSON.stringify(review)}
							onClose={() => setReview(null)}
							onCreated={onCreated}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
