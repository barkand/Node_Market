import {
  GetProducts,
  GetProductsFilter,
  GetProductItem,
  GetGroups,
} from "../business/product";

class MarketController {
  products = async (req: any, res: any) => {
    let { wallet } = req.cookies;
    let { params } = req.body;
    let { filter, lang, pages } = params;
    if (wallet === undefined) wallet = "";

    let _result = await GetProducts(wallet, filter, lang, pages);
    res.status(_result.code).send(_result);
  };

  filters = async (req: any, res: any) => {
    let { params } = req.body;
    let { lang } = params;

    let _result = await GetProductsFilter(lang);
    res.status(_result.code).send(_result);
  };

  item = async (req: any, res: any) => {
    let { wallet } = req.cookies;
    let { params } = req.body;
    let { lang, id } = params;
    if (wallet === undefined) wallet = "";

    let _result = await GetProductItem(wallet, lang, id);
    res.status(_result.code).send(_result);
  };

  groups = async (req: any, res: any) => {
    let { params } = req.body;
    let { lang } = params;

    let _result = await GetGroups(lang);
    res.status(_result.code).send(_result);
  };
}

export default new MarketController();
