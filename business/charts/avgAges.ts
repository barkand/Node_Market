import { Products } from "../../models";

import logger from "../../../log";
import { response } from "../../../core";
import { GetCache, SetCache } from "../../../core/database";

const path = "Market>Business>chart>";

const GetChartAvgAges = async () => {
  try {
    let avg_ages: any = await GetCache(`ages_count`);
    if (!avg_ages) {
      let ages_count: any = await Products.aggregate([
        { $match: { cardEn: "Golden" } },
        { $group: { _id: "$age", count: { $sum: 1 } } },
      ]);
      avg_ages = [
        { name: "15-20", value: 0, fill: "#ff99c8" },
        { name: "20-25", value: 0, fill: "#fcf6bd" },
        { name: "25-30", value: 0, fill: "#d0f4de" },
        { name: "30-35", value: 0, fill: "#a9def9" },
        { name: "35-40", value: 0, fill: "#e4c1f9" },
      ];
      for (let i = 0; i < ages_count.length; i++) {
        if (ages_count[i]._id <= 20) avg_ages[0].value += ages_count[i].count;
        if (ages_count[i]._id > 20 && ages_count[i]._id <= 25)
          avg_ages[1].value += ages_count[i].count;
        if (ages_count[i]._id > 25 && ages_count[i]._id <= 30)
          avg_ages[2].value += ages_count[i].count;
        if (ages_count[i]._id > 30 && ages_count[i]._id <= 35)
          avg_ages[3].value += ages_count[i].count;
        if (ages_count[i]._id > 35) avg_ages[4].value += ages_count[i].count;
      }

      SetCache(`ages_count`, avg_ages);
    }

    return { ...response.success, data: avg_ages };
  } catch (e: any) {
    logger.error(`${path}GetChartAvgAges: ${e}`);
    return response.error;
  }
};

export { GetChartAvgAges };
