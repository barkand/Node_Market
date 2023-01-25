import { Products, Buys } from "../../models";

import logger from "../../../log";
import { response } from "../../../core";
import { GetCache, SetCache } from "../../../core/database";

const path = "Market>Business>chart>";

const GetChartCntSales = async () => {
  try {
    let cnt_gold = await GetCache("cnt_gold");
    if (!cnt_gold) {
      cnt_gold =
        (
          await Products.aggregate([
            { $match: { cardEn: "Golden" } },
            { $group: { _id: "", count: { $sum: 1 } } },
          ])
        )[0].count ?? 0;

      SetCache("cnt_gold", cnt_gold);
    }

    let cnt_silver = await GetCache("cnt_silver");
    if (!cnt_silver) {
      cnt_silver =
        (
          await Products.aggregate([
            { $match: { cardEn: "Silver" } },
            { $group: { _id: "", count: { $sum: 1 } } },
          ])
        )[0]?.count ?? 0;

      SetCache("cnt_silver", cnt_silver);
    }

    let cnt_bronze = await GetCache("cnt_bronze");
    if (!cnt_bronze) {
      cnt_bronze =
        (
          await Products.aggregate([
            { $match: { cardEn: "Bronze" } },
            { $group: { _id: "", count: { $sum: 1 } } },
          ])
        )[0]?.count ?? 0;

      SetCache("cnt_bronze", cnt_bronze);
    }

    let gold =
      (
        await Buys.aggregate([
          { $match: { product_id: { $lt: 1000 } } },
          { $group: { _id: "", value1: { $sum: 1 } } },
        ])
      )[0]?.value1 ?? 0;

    let silver =
      (
        await Buys.aggregate([
          { $match: { product_id: { $gt: 1000, $lt: 2000 } } },
          { $group: { _id: "", value1: { $sum: 1 } } },
        ])
      )[0]?.value1 ?? 0;

    let bronze =
      (
        await Buys.aggregate([
          { $match: { product_id: { $gt: 2000 } } },
          { $group: { _id: "", value1: { $sum: 1 } } },
        ])
      )[0]?.value1 ?? 0;

    return {
      ...response.success,
      data: [
        { name: "Gold", value1: gold, value2: cnt_gold - gold },
        { name: "Silver", value1: silver, value2: cnt_silver - silver },
        { name: "Bronze", value1: bronze, value2: cnt_bronze - bronze },
      ],
    };
  } catch (e: any) {
    logger.error(`${path}GetChartCntSales: ${e}`);
    return response.error;
  }
};

export { GetChartCntSales };
