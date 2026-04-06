import { z } from "zod";

/**
 * Helper validate dữ liệu bằng Zod (Phiên bản bền vững)
 * @param schema: z.ZodType<T>
 * @param data: Dữ liệu cần validate
 */
export const validateData = <T>(schema: z.ZodType<T>, data: any) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};

    // Duyệt qua mảng issues - đây là lõi của Zod, không bao giờ lo bị deprecated
    result.error.issues.forEach((issue) => {
      // Lấy tên field từ mảng path (ví dụ: path[0] là 'title')
      const fieldName = issue.path[0]?.toString();
      
      // Chỉ lấy lỗi đầu tiên tìm thấy cho mỗi field
      if (fieldName && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });

    return { isValid: false, errors, data: null };
  }

  return { isValid: true, errors: {}, data: result.data as T };
};