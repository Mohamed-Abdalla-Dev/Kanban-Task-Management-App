// import { z } from "zod";

// export const boardSchema = z.object({
//   name: z.string().min(1, { message: "Can't be empty" }).max(50),
//   columns: z
//     .array(
//       z.object({
//         name: z.string().min(1, { message: "Can't be empty" }),
//       }),
//     )
//     .optional(),
// });

// export const taskSchema = z.object({
//   title: z.string().min(1, { message: "Can't be empty" }).max(50),
//   description: z.string().optional(),
//   status: z.string().min(1, { message: "The status must be selected." }),
//   subtasks: z
//     .array(
//       z.object({
//         title: z.string().min(1, { message: "Can't be empty" }),
//       }),
//     )
//     .optional(),
// });

// export type BoardFormValues = z.infer<typeof boardSchema>;
// export type TaskFormValues = z.infer<typeof taskSchema>;

import { z } from "zod";

export const boardSchema = z.object({
  name: z
    .string({ error: "Can't be empty" })
    .trim()
    .min(1, { message: "Can't be empty" })
    .max(50),
  columns: z
    .array(
      z.object({
        name: z
          .string({ error: "Can't be empty" })
          .trim()
          .min(1, { message: "Can't be empty" }),
      }),
    )
    .optional(),
});

export const taskSchema = z.object({
  title: z
    .string({ error: "Can't be empty" })
    .trim()
    .min(1, { message: "Can't be empty" })
    .max(50),
  description: z.string().optional(),
  status: z
    .string({ error: "The status must be selected." })
    .min(1, { message: "The status must be selected." }),
  subtasks: z
    .array(
      z.object({
        title: z
          .string({ error: "Can't be empty" })
          .trim()
          .min(1, { message: "Can't be empty" }),
      }),
    )
    .optional(),
});

export type BoardFormValues = z.infer<typeof boardSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
