export const listFrom = (data, keys = []) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

export const oneFrom = (data, keys = []) => {
  for (const key of keys) {
    if (data?.[key]) return data[key];
  }
  return data;
};

export const errorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN");
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN");
};
