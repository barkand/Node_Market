import { Buys, Products, Favorites } from "../models";

import logger from "../../log";
import { response } from "../../core";

const path = "Market>Business>buy>";

const GetBuyByUser = async (user: number, pages: any) => {
  try {
    let buys: any = await Buys.find({ user_id: user });
    let counts = await Buys.find({ user_id: user }).count();
    let favorites: any = await Favorites.find({ user_id: user });

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

const GetBuyByItem = async (item: number) => {
  try {
    let history: any = await Buys.find(
      { product_id: item },
      { _id: 0, user_id: 1, price: 1 }
    );

    return { ...response.success, data: history };
  } catch (e: any) {
    logger.error(`${path}GetBuyByItem: ${e}`);
    return response.error;
  }
};

const GetBuy = async (item: number) => {
  try {
    let buy: any = await Buys.findOne(
      { product_id: item },
      { _id: 0, user_id: 1, price: 1, txn: 1 }
    ).sort({ $natural: -1 });

    return { ...response.success, data: buy };
  } catch (e: any) {
    logger.error(`${path}GetBuy: ${e}`);
    return response.error;
  }
};

const SetBuy = async (
  user: number,
  product: number,
  price: number,
  txn: string
) => {
  try {
    let _buys = new Buys({
      user_id: user,
      product_id: product,
      price: price,
      txn: txn,
    });
    await _buys.save();

    await Products.updateOne({ id: product }, { $set: { forSale: false } });

    return response.success;
  } catch (e: any) {
    logger.error(`${path}SetBuy: ${e}`);
    return response.error;
  }
};

const CheckBuy = async (product: number) => {
  try {
    let _bought = await Buys.findOne({
      product_id: product,
    });
    if (!_bought) return response.custom(300, "exist");

    return response.success;
  } catch (e: any) {
    logger.error(`${path}CheckBuy: ${e}`);
    return response.error;
  }
};

const SavePrice = async (user: any, product: number, price: number) => {
  try {
    let _bought = await Buys.findOne({
      user_id: user,
      product_id: product,
    });
    if (!_bought) return response.error;

    await Products.updateOne({ id: product }, { $set: { price: price } });
    return response.success;
  } catch (e: any) {
    logger.error(`${path}SavePrice: ${e}`);
    return response.error;
  }
};

const SaveForSale = async (user: any, product: number, forSale: boolean) => {
  try {
    let _bought = await Buys.findOne({
      user_id: user,
      product_id: product,
    });
    if (!_bought) return response.error;

    await Products.updateOne({ id: product }, { $set: { forSale: forSale } });
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
  SavePrice,
  SaveForSale,
};
