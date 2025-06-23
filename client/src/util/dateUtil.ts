export const formatDate = (date: Date | string) => {
  if (!date) {
    return 'Unknown';
  }

  const pDateAsDate: Date =
    typeof date === 'string' ? new Date(date) : (date as Date);

  return pDateAsDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year:
      pDateAsDate.getFullYear() !== new Date().getFullYear()
        ? 'numeric'
        : undefined,
  });
};
