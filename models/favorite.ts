import mongoose from "mongoose";

const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
  user_id: { type: String },
  product_id: { type: Number },
});

export default mongoose.model("Favorites", favoritesSchema);
