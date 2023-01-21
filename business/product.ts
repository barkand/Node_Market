import { Products, Favorites, Buys } from "../models";
import { GetCacheGroups, SetCacheGroups } from "./cache/product";

import logger from "../../log";
import { response } from "../../core";
import { Notifications } from "../../admin/models";

const path = "Market>Business>product>";

const GetProducts = async (
  user: string,
  filter: any,
  lang: string,
  pages: any
) => {
  let _condition: any = {};
  try {
    if (Object.keys(filter).length > 0) {
      if (filter.team.length > 0)
        _condition =
          lang === "en"
            ? { ..._condition, teamEn: { $in: filter.team } }
            : { ..._condition, team: { $in: filter.team } };

      if (filter.country.length > 0)
        _condition =
          lang === "en"
            ? { ..._condition, countryEn: { $in: filter.country } }
            : { ..._condition, country: { $in: filter.country } };

      if (filter.position.length > 0)
        _condition =
          lang === "en"
            ? { ..._condition, positionEn: { $in: filter.position } }
            : { ..._condition, position: { $in: filter.position } };

      if (filter.card.length > 0)
        _condition =
          lang === "en"
            ? { ..._condition, cardEn: { $in: filter.card } }
            : { ..._condition, card: { $in: filter.card } };

      if (filter.age.length > 0)
        _condition = {
          ..._condition,
          age: { $gt: filter.age[0], $lt: filter.age[1] },
        };
    }

    let products: any = await Products.find(_condition)
      .skip(pages.pageNumber > 0 ? (pages.pageNumber - 1) * pages.perPage : 0)
      .limit(pages.perPage);

    let counts = await Products.find(_condition).count();
    let favorites: any =
      user !== ""
        ? await Favorites.find({
            user_id: user,
            product_id: { $in: products.map((p: any) => p.id) },
          })
        : [];
    let buys: any = await Buys.find({
      product_id: { $in: products.map((p: any) => p.id) },
    });

    let _products: any = [];
    products.forEach((product: any) => {
      _products.push({
        id: product.id,
        name: product.name,
        image: `${product.cardEn.toLowerCase()}/${product.code}.png`,
        price: product.price,
        liked:
          user === ""
            ? false
            : favorites.some((fav: any) => fav.product_id === product.id),
        soled: buys.some((b: any) => b.product_id === product.id),
        forSale:
          product.forSale &&
          !buys.some(
            (b: any) => b.product_id === product.id && b.user_id === user
          ),
      });
    });

    return {
      ...response.success,
      data: { products: _products, counts: counts },
    };
  } catch (e: any) {
    logger.error(`${path}GetProducts: ${e}`);
    return response.error;
  }
};

const GetProductsFilter = async (lang: string) => {
  let teams: any = [];
  let countries: any = [];
  let positions: any = [];
  let cards: any = [];
  let ages: any = [];

  try {
    if (lang === "en") {
      positions = await Products.distinct("positionEn");
      countries = await Products.distinct("countryEn");
      teams = await Products.distinct("teamEn");
      cards = ["Golden", "Silver", "Bronze"]; //TODO: await Products.distinct("cardEn");
    } else {
      positions = await Products.distinct("position");
      countries = await Products.distinct("country");
      teams = await Products.distinct("team");
      cards = ["طلایی", "نقره ای", "برنزی"]; //TODO: await Products.distinct("card");
    }

    let _ages = await Products.aggregate([
      {
        $group: {
          _id: null,
          max: { $max: "$age" },
          min: { $min: "$age" },
        },
      },
    ]);

    ages = [_ages[0].min, _ages[0].max];

    return {
      ...response.success,
      data: {
        teams: teams.sort(),
        countries: countries.sort(),
        positions: positions.sort(),
        cards: cards,
        ages: ages,
      },
    };
  } catch (e: any) {
    logger.error(`${path}GetProductsFilter: ${e}`);
    return response.error;
  }
};

const GetProductItem = async (user: string, lang: string, id: number) => {
  try {
    let product: any = await Products.findOne({ id: id }, { _id: 0 });
    let liked: any =
      user === "" ||
      (await Favorites.count({ user_id: user, product_id: product.id })) === 0
        ? false
        : true;

    let _buy: any = await Buys.findOne({ product_id: product.id });
    let soled = _buy ? true : false;

    let notified: any =
      user === "" ||
      (await Notifications.count({
        user_id: user,
        refer_id: product.id,
        seen: false,
        active: false,
      })) === 0
        ? false
        : true;

    return {
      ...response.success,
      data: {
        id: product.id,
        code: product.code,
        name: lang === "en" ? product.nameEn : product.name,
        number: product.number,
        age: product.age,
        team: lang === "en" ? product.teamEn : product.team,
        country: lang === "en" ? product.countryEn : product.country,
        position: lang === "en" ? product.positionEn : product.position,
        card: lang === "en" ? product.cardEn : product.card,
        image: `${product.cardEn.toLowerCase()}/${product.code}.png`,
        price: product.price,
        liked: liked,
        soled: soled,
        forSale: product.forSale,
        notified: notified,
        owner: _buy?.user_id,
      },
    };
  } catch (e: any) {
    logger.error(`${path}GetProductItem: ${e}`);
    return response.error;
  }
};

const GetGroups = async (lang: string) => {
  try {
    let teams: any = await GetCacheGroups(lang);

    if (teams) {
    } else {
      let teams: any = await Products.aggregate([
        {
          $group: {
            _id: { id: "$teamId", title: lang === "en" ? "$teamEn" : "$team" },
          },
        },
      ]);

      SetCacheGroups(lang, teams);
    }
    return { ...response.success, data: teams };
  } catch (e: any) {
    logger.error(`${path}GetGroups: ${e}`);
    return response.error;
  }
};

export { GetProducts, GetProductsFilter, GetProductItem, GetGroups };
