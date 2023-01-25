import {
  GetChartAvgAges,
  GetChartCntPosition,
  GetChartCntSales,
} from "../business/charts";

class ChartController {
  chartAvgAges = async (req: any, res: any) => {
    let _result = await GetChartAvgAges();
    res.status(_result.code).send(_result);
  };

  chartCntPosition = async (req: any, res: any) => {
    let { params } = req.body;
    let { lang } = params;

    let _result = await GetChartCntPosition(lang);
    res.status(_result.code).send(_result);
  };

  chartCntSales = async (req: any, res: any) => {
    let _result = await GetChartCntSales();
    res.status(_result.code).send(_result);
  };
}

export default new ChartController();
