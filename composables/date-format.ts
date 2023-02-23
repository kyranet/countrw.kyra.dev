const dtf = new Intl.DateTimeFormat();

export const formatDate = (date: number | Date) => dtf.format(date);
