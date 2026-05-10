import { requireNativeComponent } from "react-native";

export function formatDate(dateString: string): string {
  // 1. Khởi tạo đối tượng Date từ chuỗi ISO
  const date = new Date(dateString);

  // 2. Định dạng theo chuẩn tiếng Việt và múi giờ Hồ Chí Minh
  const vnTime = date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour12: false, // Sử dụng định dạng 24h
  });

  // 3. Loại bỏ dấu phẩy (nếu có) để ra định dạng "10:49:53 10/5/2026"
  return vnTime.replace(",", "");
}

export function getTimeDifference(dateString: string) {
  const past = new Date(dateString)
  const now = new Date()

  const diffInMs = now.getTime() - past.getTime()

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)) 
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYear = Math.floor(diffInMonths / 12)

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 30) return `${diffInDays}d ago`
  if (diffInMonths < 12) return `${diffInMonths}mo ago`

  return `${diffInYear}y ago`
}

export function formatMonthDate(dateString: string) {
  const date = new Date(dateString);
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}