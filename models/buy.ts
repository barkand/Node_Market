import mongoose from "mongoose";

const Schema = mongoose.Schema;

const buySchema = new Schema({
  user_id: { type: String },
  product_id: { type: Number },
  price: { type: Number },
  txn: { type: String },
  new_price: { type: Number },
  for_sale: { type: Boolean },
  soled: { type: Boolean },
  new_txn: { type: String },
});

export default mongoose.model("Buy", buySchema);
