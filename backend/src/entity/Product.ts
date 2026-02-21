import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({ name: "products" })
@Unique(["title", "category"])
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  price!: string; // numeric comes as string from pg

  @Column({ type: "varchar", length: 10, default: "USD" })
  currency!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ type: "varchar", length: 80, default: "General" })
  category!: string;

  @Column({ type: "int", default: 0 })
  stock!: number;


  @Column({ type: "int", default: 0 })
  discountPercent!: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}