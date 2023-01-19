import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productsSchema = new Schema({
  id: { type: Number },
  code: { type: Number },
  name: { type: String },
  nameEn: { type: String },
  number: { type: Number },
  age: { type: Number },
  position: { type: String },
  positionEn: { type: String },
  teamId: { type: Number },
  team: { type: String },
  teamEn: { type: String },
  country: { type: String },
  countryEn: { type: String },
  card: { type: String },
  cardEn: { type: String },
  price: { type: Number },
  forSale: { type: Boolean },
});

export default mongoose.model("Products", productsSchema);
