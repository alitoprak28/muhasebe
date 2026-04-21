export const calculateInvoiceTotals = (items) => {
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const vatRate = Number(item.vatRate || 0);
    const subtotal = quantity * unitPrice;
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    return {
      description: item.description,
      quantity,
      unitPrice,
      vatRate,
      subtotal,
      vatAmount,
      total,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const vatTotal = normalizedItems.reduce((sum, item) => sum + item.vatAmount, 0);
  const grandTotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);

  return {
    items: normalizedItems,
    subtotal,
    vatTotal,
    grandTotal,
  };
};

export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const lastNMonths = (count) => {
  const months = [];
  const today = new Date();

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    months.push({
      label: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999),
    });
  }

  return months;
};

