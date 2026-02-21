import { Router } from "express";
import { z } from "zod";
import { AppDataSource } from "../dataSource";
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

/**
 * GET /api/products/:id
 * returns product details
 */
productRouter.get("/:id", async (req, res) => {
  const product = await repo.findOne({ where: { id: req.params.id } });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

/**
 * POST /api/products/:id/buy
 * reduce stock by 1, emit buy event to Kafka for invoice creation
 */
productRouter.post("/:id/buy", async (req, res) => {
  const product = await repo.findOne({ where: { id: req.params.id } });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < 1) {
    return res.status(400).json({ message: "Product out of stock" });
  }

  product.stock -= 1;
  await repo.save(product);

  const { publishBuyEvent } = await import("../kafka");
  await publishBuyEvent({
    productId: product.id,
    productTitle: product.title,
    price: product.price,
    currency: product.currency,
    quantity: 1,
    boughtAt: new Date().toISOString(),
  });

  res.json({ success: true, product });
});