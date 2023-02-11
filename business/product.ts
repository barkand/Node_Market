import { Products, Favorites, Buys } from "../models";

import logger from "../../log";
import { response, toPascalCase } from "../../core";
import { Notifications } from "../../admin/models";
import { GetCache, SetCache } from "../../core/database";

const path = "Market>Business>product>";

const GetProducts = async (
  user_id: string,
  filter: any,
  lang: string,
  pages: any
) => {
  try {
    let { country, team, position, age, card } = filter;
    let _condition: any = await GetCache(
      `Products_condition:${lang}:${country}:${team}:${position}:${age}:${card}:${pages}`
    );

    if (!_condition) {
      if (Object.keys(filter).length > 0) {
        if (filter.team.length > 0)
          _condition =
            lang === "en"
              ? { ..._condition, teamEn: { $in: filter.team } }
              : { ..._condition, teamFa: { $in: filter.team } };

        if (filter.country.length > 0)
          _condition =
            lang === "en"
              ? { ..._condition, countryEn: { $in: filter.country } }
              : { ..._condition, countryFa: { $in: filter.country } };

        if (filter.position.length > 0)
          _condition =
            lang === "en"
              ? { ..._condition, positionEn: { $in: filter.position } }
              : { ..._condition, positionFa: { $in: filter.position } };

        if (filter.card.length > 0)
          _condition =
            lang === "en"
              ? { ..._condition, cardEn: { $in: filter.card } }
              : { ..._condition, cardFa: { $in: filter.card } };

        if (filter.age.length > 0)
          _condition = {
            ..._condition,
            age: { $gt: filter.age[0], $lt: filter.age[1] },
          };
      }

      SetCache(
        `Products_condition:${lang}:${country}:${team}:${position}:${age}:${card}:${pages}`,
        _condition
      );
    }

    let _products = await Products.find(_condition)
      .skip(pages.pageNumber > 0 ? (pages.pageNumber - 1) * pages.perPage : 0)
      .limit(pages.perPage);

    let counts = await Products.find(_condition).count();
    let favorites: any =
      user_id !== ""
        ? await Favorites.find({
            user_id: user_id,
            product_id: { $in: _products.map((p: any) => p.id) },
          })
        : [];
    let buys: any = await Buys.find({
      product_id: { $in: _products.map((p: any) => p.id) },
    });

    let products = [];
    _products.forEach((product: any) => {
      products.push({
        id: product.id,
        nameEn: product.nameEn,
        image: `${product.cardEn.toLowerCase()}/${product.code}.png`,
        price: product.price,
        liked:
          user_id === ""
            ? false
            : favorites.some((fav: any) => fav.product_id === product.id),
        soled: buys.some((b: any) => b.product_id === product.id),
        forSale:
          buys.some(
            (b: any) =>
              b.product_id === product.id &&
              b.soled === false &&
              b.forSale === true
          ) &&
          !buys.some(
            (b: any) => b.product_id === product.id && b.user_id === user_id
          ),
      });
    });

    return {
      ...response.success,
      data: { products: products, counts: counts },
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
    let data = await GetCache(`ProductsFilter:${lang}`);
    if (!data) {
      positions = await Products.distinct(`position${toPascalCase(lang)}`);
      countries = await Products.distinct(`country${toPascalCase(lang)}`);
      teams = await Products.distinct(`team${toPascalCase(lang)}`);
      cards =
        lang === "en" //TODO: await Products.distinct(`card${toPascalCase(lang)}`);
          ? ["Golden", "Silver", "Bronze"]
          : ["طلایی", "نقره ای", "برنزی"];
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

      data = {
        teams: teams.sort(),
        countries: countries.sort(),
        positions: positions.sort(),
        cards: cards,
        ages: ages,
      };

      SetCache(`ProductsFilter:${lang}`, data);
    }

    return {
      ...response.success,
      data: data,
    };
  } catch (e: any) {
    logger.error(`${path}GetProductsFilter: ${e}`);
    return response.error;
  }
};

const GetProductItem = async (
  user_id: string,
  lang: string,
  product_id: number
) => {
  try {
    let product: any = await GetCache(`ProductsItem:${product_id}`);
    if (!product) {
      product = await Products.findOne({ id: product_id }, { _id: 0 });

      SetCache(`ProductsItem:${product_id}`, product);
    }

    let _buy: any = await Buys.findOne({ product_id: product.id });
    let soled = _buy ? true : false;
    let liked: any =
      user_id === "" ||
      (await Favorites.count({ user_id: user_id, product_id: product.id })) ===
        0
        ? false
        : true;
    let forSale = _buy.some(
      (b: any) => b.soled === false && b.forSale === true
    );

    let notified: any =
      user_id === "" ||
      (await Notifications.count({
        user_id: user_id,
        refer_id: product.id,
        seen: false,
        active: false,
      })) === 0
        ? false
        : true;

    let data: any = {
      id: product.id,
      code: product.code,
      number: product.number,
      age: product.age,
      nameEn: product.nameEn,
      name: lang === "en" ? product.nameEn : product.nameFa,
      team: lang === "en" ? product.teamEn : product.teamFa,
      country: lang === "en" ? product.countryEn : product.countryFa,
      position: lang === "en" ? product.positionEn : product.positionFa,
      card: lang === "en" ? product.cardEn : product.cardFa,
      image: `${product.cardEn.toLowerCase()}/${product.code}.png`,
      price: product.price,
      liked: liked,
      soled: soled,
      forSale: forSale,
      notified: notified,
      owner: _buy?.user_id,
    };

    return {
      ...response.success,
      data: data,
    };
  } catch (e: any) {
    logger.error(`${path}GetProductItem: ${e}`);
    return response.error;
  }
};

const GetProduct = async (product_id: number) => {
  try {
    let product: any = await GetCache(`GetProduct:${product_id}`);

    if (!product) {
      product = await Products.findOne({ id: product_id }, { _id: 0 });
      SetCache(`GetProduct:${product_id}`, product);
    }

    return { ...response.success, data: product };
  } catch (e: any) {
    logger.error(`${path}GetProduct: ${e}`);
    return response.error;
  }
};

const GetGroups = async (lang: string) => {
  try {
    let teams: any = await GetCache(`Groups:${lang}`);

    if (!teams) {
      teams = await Products.aggregate([
        {
          $group: {
            _id: {
              id: "$teamId",
              title: `$team${toPascalCase(lang)}`,
            },
          },
        },
      ]);

      SetCache(`Groups:${lang}`, teams);
    }

    return { ...response.success, data: teams };
  } catch (e: any) {
    logger.error(`${path}GetGroups: ${e}`);
    return response.error;
  }
};

export {
  GetProducts,
  GetProductsFilter,
  GetProductItem,
  GetProduct,
  GetGroups,
};
