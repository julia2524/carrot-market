import z from "zod";

export const productClientSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price is require"),
});

export type ProductType = z.infer<typeof productClientSchema>;

export const productServerSchema = z.object({
  photo: z.instanceof(File, { message: "Photo is required" }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price is require"),
});
