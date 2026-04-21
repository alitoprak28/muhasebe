export const buildDateRangeFilter = (dateField, query) => {
  const filter = {};

  if (query.startDate || query.endDate) {
    filter[dateField] = {};
  }

  if (query.startDate) {
    filter[dateField].$gte = new Date(query.startDate);
  }

  if (query.endDate) {
    const endDate = new Date(query.endDate);
    endDate.setHours(23, 59, 59, 999);
    filter[dateField].$lte = endDate;
  }

  return filter;
};

export const parsePagination = (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

