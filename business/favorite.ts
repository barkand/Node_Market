import { Favorites, Buys } from "../models";

import logger from "../../log";
import { response } from "../../core";
import { Products } from "../../market/models";

const path = "Market>Business>favorite>";

const GetFavorites = async (user_id: string, pages: any) => {
  try {
    let favorites: any = await Favorites.find({ user_id: user_id });
    let counts = await Favorites.find({ user_id: user_id }).count();

    let _favorites: any = [];
    let skip =
      pages.pageNumber > 0 ? (pages.pageNumber - 1) * pages.perPage : 0;
    let to =
      pages.perPage > favorites.length - skip
        ? favorites.length
        : pages.perPage + skip;

    for (let i = skip; i < to; i++) {
      let product: any = await Products.findOne({
        id: favorites[i].product_id,
      });
      _favorites.push({
        id: product.id,
        price: product.price,
        image: `${product.cardEn.toLowerCase()}/${product.code}.png`,
        liked: true,
        soled:
          (await Buys.count({ product_id: product.id })) > 0 ? true : false,
        forSale:
          product.forSale &&
          (await Buys.count({ product_id: product.id, user_id: user_id })) === 0
            ? true
            : false,
      });
    }

    return {
      ...response.success,
      data: { products: _favorites, counts: counts },
    };
  } catch (e: any) {
    logger.error(`${path}GetFavorites: ${e}`);
    return response.error;
  }
};

const SetFavorite = async (user_id: string, product_id: number) => {
  try {
    let _haveLike = await Favorites.findOne({
      user_id: user_id,
      product_id: product_id,
    });

    if (_haveLike) {
      try {
        await Favorites.deleteOne({ _id: _haveLike._id });
        return response.custom(200, "unlike");
      } catch (e: any) {
        logger.error(`${path}SetFavorite_haveLike: ${e}`);
        return response.error;
      }
    } else {
      let _favorites = new Favorites({
        user_id: user_id,
        product_id: product_id,
      });
      try {
        await _favorites.save();
        return response.custom(200, "liked");
      } catch (e: any) {
        logger.error(`${path}SetFavorite: ${e}`);
        return response.error;
      }
    }
  } catch (e: any) {
    logger.error(`${path}GetFavorites: ${e}`);
    return response.error;
  }
};

export { GetFavorites, SetFavorite };
