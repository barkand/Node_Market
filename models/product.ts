import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productsSchema = new Schema({
  id: { type: Number },
  code: { type: Number },
  nameFa: { type: String },
  nameEn: { type: String },
  number: { type: Number },
  age: { type: Number },
  positionFa: { type: String },
  positionEn: { type: String },
  teamId: { type: Number },
  teamFa: { type: String },
  teamEn: { type: String },
  countryFa: { type: String },
  countryEn: { type: String },
  cardFa: { type: String },
  cardEn: { type: String },
  price: { type: Number },
});

export default mongoose.model("Products", productsSchema);
