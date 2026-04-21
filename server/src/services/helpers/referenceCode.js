export const generateReferenceCode = (prefix) => {
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${Date.now()}-${randomPart}`;
};

