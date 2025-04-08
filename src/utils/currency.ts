export function formatToRupiah(amount: number): string {
	return `Rp${amount.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}