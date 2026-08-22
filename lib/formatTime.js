export function formatRelativeTime(dateString) {
  if (!dateString) return "tarih yok";
  
  let date;
  // Backend'den gelen DD.MM.YYYY HH:mm:ss (Türkiye formatı) ise:
  if (typeof dateString === "string" && dateString.includes(".")) {
    const parts = dateString.split(" ");
    if (parts.length === 2) {
      const [day, month, year] = parts[0].split(".");
      const [hour, minute, second] = parts[1].split(":");
      // JS Date ayı 0'dan başlatır
      date = new Date(year, month - 1, day, hour, minute, second);
    }
  }

  // Değilse normal parse (ISO vs)
  if (!date || isNaN(date.getTime())) {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return "tarih yok";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes} - ${day}.${month}.${year}`;
}
