export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/
);
export const PASSWORD_REGEX_ERROR =
  "A password must have lowercase, UPPERCASE, a number and special characters.";

export const PRODUCT_STATUS = {
  FOR_SALE: "FOR_SALE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const statusStyles = {
  FOR_SALE: {
    label: "판매중",
    bgColor: "bg-orange-500",
  },
  RESERVED: {
    label: "예약중",
    bgColor: "bg-green-500",
  },
  SOLD: {
    label: "판매완료",
    bgColor: "bg-neutral-500",
  },
};
