import { Router } from "express";
import { z } from "zod";
import { AppDataSource } from "../datasource";
import { Product } from "../entity/Product";

export const productRouter = Router();

const repo = AppDataSource.getRepository(Product);

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  currency: z.string().length(3).default("USD"),
});

/**
 * GET /api/products
 * returns list of products
 */
productRouter.get("/", async (_req, res) => {
  const products = await repo.find({
    order: { createdAt: "DESC" }
  });
  res.json(products);
});

/**
 * POST /api/products
 * create a product (name, description, price, imageUrl, currency)
 */
productRouter.post("/", async (req, res) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }
  const { name, description, price, imageUrl, currency } = parsed.data;
  const product = repo.create({
    title: name,
    description,
    price: String(price),
    imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
    currency: currency || "USD",
  });
  const saved = await repo.save(product);
  res.status(201).json(saved);
});
