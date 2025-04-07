import mongoose,{Document} from "mongoose";
import { Product } from "../models/Product.model.js";
import { invalidateCacheType, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.model.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "Ecommerce_24" })
    .then((c) => console.log(`DB is connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache =  ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: invalidateCacheType) => {
  if (product) {
    const productkeys: string[] = [
      "all-products",
      "categories",
      "latest-products",
    ];
    if (typeof productId ==="string") {
      productkeys.push( `product-${productId}`)
    }
    if (typeof productId ==="object") {
      productId.forEach(i => {
      productkeys.push( `product-${i}`)
      });
    }
    myCache.del(productkeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `orders-${orderId}`,
    ];
    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts"
    ])
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error("Product Not Found");
    }
    product.stock -= order.quantity;
    await product.save();
  }
};


export const calculatePercantage= (thisMonth:number,lastMonth:number)=>{

  if(lastMonth==0) return thisMonth*100
  const percant = ((thisMonth)/lastMonth)*100
  return Number(percant.toFixed(0))
}


export const getInventories = async (
  {categories,productsCount}:{categories:string[],productsCount:number}
)=>{
  const categoryCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );
  const categoriesCount = await Promise.all(categoryCountPromise);
  const categoryCount: Record<string, number>[] = [];
  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });
  return categoryCount
}
interface MyDocument extends Document{
  createdAt:Date,
  discount?:number,
  total?:number,
}

type FuncProps={
  length :number
  docArr:MyDocument[]
  today:Date
  property?: "discount" | "total";  

}

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};