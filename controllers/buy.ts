import {
  GetBuyByUser,
  GetBuyByItem,
  GetBuy,
  SetBuy,
  CheckBuy,
  SavePrice,
  SaveForSale,
} from "../business/buy";
import { GetProduct } from "../business/product";

import { verifyToken } from "../../admin";

import { ActiveNotify } from "../../admin/business/notify";
import { SaveFile } from "../../core";

class BuyController {
  buyByUser = async (req: any, res: any) => {
    let { user_id, token } = req.cookies;
    let { params } = req.body;
    let { pages } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result = await GetBuyByUser(user_id, pages);
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
    const { user_id, token } = req.cookies;
    let { params } = req.body;
    let { product, price, txn } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _res: any = await GetProduct(product);
    let _prod: any = _res.data;
    var data = `{
      "name": "${_prod.nameEn}",
      "description": "Footballiga NFT Card",
      "image": "${
        process.env.SITE_PATH
      }/products/${_prod.cardEn.toLowerCase()}/${product}.png",
      "external_url": "${process.env.SITE_PATH}/#/Item/${product}"
}`;
    SaveFile(
      data,
      `${
        process.env.SERVER_PATH
      }/metadata/${_prod.cardEn.toLowerCase()}/${product}.json`
    );

    let _result = await SetBuy(user_id, product, price, txn);
    res.status(_result.code).send(_result);
  };

  checkBuy = async (req: any, res: any) => {
    const { token } = req.cookies;
    let { params } = req.body;
    let { product } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result = await CheckBuy(product);
    res.status(_result.code).send(_result);
  };

  updatePrice = async (req: any, res: any) => {
    const { user_id, token } = req.cookies;
    let { params } = req.body;
    let { product, price } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result = await SavePrice(user_id, product, price);
    res.status(_result.code).send(_result);
  };

  saveForSale = async (req: any, res: any) => {
    const { user_id, token } = req.cookies;
    let { params } = req.body;
    let { product, forSale } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result_save = await SaveForSale(user_id, product, forSale);
    if (_result_save.code !== 200) {
      res.status(_result_save.code).send(_result_save);
      return;
    }

    let _result_active_notify = await ActiveNotify(product);

    res.status(_result_active_notify.code).send(_result_active_notify);
  };
}

export default new BuyController();
