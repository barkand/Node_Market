import {
  GetBuyByUser,
  GetBuyByItem,
  GetBuy,
  SetBuy,
  CheckBuy,
  SavePrice,
  SaveForSale,
} from "../business/buy";

import { verifyToken } from "../../admin";

import { ActiveNotify } from "../../admin/business/notify";

class BuyController {
  buyByUser = async (req: any, res: any) => {
    let { wallet, token } = req.cookies;
    let { params } = req.body;
    let { pages } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await GetBuyByUser(wallet, pages);
    res.status(_result.code).send(_result);
  };

  buyByItem = async (req: any, res: any) => {
    let { params } = req.body;
    let { productId } = params;

    let _result = await GetBuyByItem(productId);
    res.status(_result.code).send(_result);
  };

  buy = async (req: any, res: any) => {
    let { params } = req.body;
    let { productId } = params;

    let _result = await GetBuy(productId);
    res.status(_result.code).send(_result);
  };

  saveBuy = async (req: any, res: any) => {
    const { wallet, token } = req.cookies;
    let { params } = req.body;
    let { product, price, txn } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await SetBuy(wallet, product, price, txn);
    res.status(_result.code).send(_result);
  };

  checkBuy = async (req: any, res: any) => {
    const { token } = req.cookies;
    let { params } = req.body;
    let { product } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await CheckBuy(product);
    res.status(_result.code).send(_result);
  };

  updatePrice = async (req: any, res: any) => {
    const { wallet, token } = req.cookies;
    let { params } = req.body;
    let { product, price } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await SavePrice(wallet, product, price);
    res.status(_result.code).send(_result);
  };

  saveForSale = async (req: any, res: any) => {
    const { wallet, token } = req.cookies;
    let { params } = req.body;
    let { product, forSale } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result_save = await SaveForSale(wallet, product, forSale);
    if (_result_save.code !== 200)
      res.status(_result_save.code).send(_result_save);

    let _result_active_notify = await ActiveNotify(product);

    res.status(_result_active_notify.code).send(_result_active_notify);
  };
}

export default new BuyController();
