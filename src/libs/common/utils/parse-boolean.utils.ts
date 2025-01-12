export function parseBoolean(value: string): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const loverValue = value.trim().toLowerCase();
    if (loverValue === 'true') {
      return true;
    } else if (loverValue === 'false') {
      return false;
    }
  }

  throw new Error(
    `Не удалось преобразить значение ${value} в логическое значение.`,
  );
}
