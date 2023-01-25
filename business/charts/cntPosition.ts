import { Products } from "../../models";

import { toPascalCase } from "../../../core/libs";

import logger from "../../../log";
import { response } from "../../../core";
import { GetCache, SetCache } from "../../../core/database";

const path = "Market>Business>chart>";

const GetChartCntPosition = async (lang: string) => {
  const colors: any = ["#0d1321", "#1d2d44", "#3e5c76", "#748cab"];

  try {
    let post_count: any = await GetCache(`cntPost:${lang}`);
    if (!post_count) {
      let _post_count = await Products.aggregate([
        { $match: { cardEn: "Golden" } },
        {
          $group: {
            _id: `$position${toPascalCase(lang)}`,
            value: { $sum: 1 },
          },
        },
      ]);

      post_count = [];
      _post_count.map((item: any, idx: number) => {
        post_count.push({ ...item, name: item._id, fill: colors[idx] });
      });

      SetCache(`cntPost:${lang}`, post_count);
    }

    return { ...response.success, data: post_count };
  } catch (e: any) {
    logger.error(`${path}GetChartCntPosition: ${e}`);
    return response.error;
  }
};

export { GetChartCntPosition };
