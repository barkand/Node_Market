import { Buys, Products, Favorites } from "../models";

import logger from "../../log";
import { response } from "../../core";

const path = "Market>Business>buy>";

const GetBuyByUser = async (user_id: string, pages: any) => {
  try {
    let buys: any = await Buys.find({ user_id: user_id, soled: false });
    let counts = await Buys.find({ user_id: user_id }).count();
    let favorites: any = await Favorites.find({ user_id: user_id });

    let _buys: any = [];
    let skip =
      pages.pageNumber > 0 ? (pages.pageNumber - 1) * pages.perPage : 0;
    let to =
      pages.perPage > buys.length - skip ? buys.length : pages.perPage + skip;

    for (let i = skip; i < to; i++) {
      let product: any = await Products.findOne({ id: buys[i].product_id });
      _buys.push({
        id: product.id,
        price: product.price,
        image: `${product.cardEn.toLowerCase()}/${product.code}.png`,
        liked: favorites.some((fav: any) => fav.product_id === product.id),
        soled: true,
        forSale: false,
      });
    }

    return { ...response.success, data: { products: _buys, counts: counts } };
  } catch (e: any) {
    logger.error(`${path}GetBuyByUser: ${e}`);
    return response.error;
  }
};

const GetBuyByItem = async (product_id: number) => {
  try {
    let history: any = await Buys.find(
      { product_id: product_id },
      { _id: 0, user_id: 1, price: 1 }
    );

    return { ...response.success, data: history };
  } catch (e: any) {
    logger.error(`${path}GetBuyByItem: ${e}`);
    return response.error;
  }
};

const GetBuy = async (product_id: number) => {
  try {
    let buy: any = await Buys.findOne(
      { product_id: product_id },
      { _id: 0, user_id: 1, price: 1, txn: 1 }
    ).sort({ $natural: -1 });

    return { ...response.success, data: buy };
  } catch (e: any) {
    logger.error(`${path}GetBuy: ${e}`);
    return response.error;
  }
};

const SetBuy = async (
  user_id: string,
  product_id: number,
  price: number,
  txn: string
) => {
  try {
    await Buys.updateOne(
      {
        product_id: product_id,
        new_price: price,
        for_sale: true,
        soled: false,
      },
      { new_txn: txn, for_sale: false, soled: true }
    );

    let new_buys = new Buys({
      user_id: user_id,
      product_id: product_id,
      price: price,
      txn: txn,
      new_price: price,
      for_sale: false,
      soled: false,
    });
    await new_buys.save();

    return response.success;
  } catch (e: any) {
    logger.error(`${path}SetBuy: ${e}`);
    return response.error;
  }
};

const CheckBuy = async (product_id: number) => {
  try {
    let _bought = await Buys.findOne({
      product_id: product_id,
    });
    if (!_bought) return response.custom(300, "exist");

    return response.success;
  } catch (e: any) {
    logger.error(`${path}CheckBuy: ${e}`);
    return response.error;
  }
};

const ValidateBuy = async (user_id: number) => {
  try {
    let _buys_count = await Buys.count({ user_id: user_id, soled: false });
    if (_buys_count >= parseInt(process.env.MAXIMUM_CARD))
      return response.custom(300, "full");

    return response.success;
  } catch (e: any) {
    logger.error(`${path}ValidateBuy: ${e}`);
    return response.error;
  }
};

const SavePrice = async (
  user_id: string,
  product_id: number,
  price: number
) => {
  try {
    await Buys.updateOne(
      { user_id: user_id, product_id: product_id, soled: false },
      { $set: { new_price: price } }
    );

    return response.success;
  } catch (e: any) {
    logger.error(`${path}SavePrice: ${e}`);
    return response.error;
  }
};

const SaveForSale = async (
  user_id: string,
  product_id: number,
  for_sale: boolean
) => {
  try {
    await Buys.updateOne(
      { user_id: user_id, product_id: product_id, soled: false },
      { $set: { for_sale: for_sale } }
    );
    return response.success;
  } catch (e: any) {
    logger.error(`${path}SaveForSale: ${e}`);
    return response.error;
  }
};

export {
  GetBuyByUser,
  GetBuyByItem,
  GetBuy,
  SetBuy,
  CheckBuy,
  ValidateBuy,
  SavePrice,
  SaveForSale,
};
