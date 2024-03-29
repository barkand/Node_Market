import express from "express";

import marketController from "../controllers/market";
import favoriteController from "../controllers/favorite";
import buyController from "../controllers/buy";
import chartController from "../controllers/chart";

const MarketRouters = express.Router();
MarketRouters.use(express.json());

MarketRouters.post(`/products`, marketController.products);
MarketRouters.post(`/filters`, marketController.filters);
MarketRouters.post(`/item`, marketController.item);
MarketRouters.post(`/get-groups`, marketController.groups);

MarketRouters.post(`/favorites`, favoriteController.favorites);
MarketRouters.post(`/save-favorite`, favoriteController.saveFavorite);

MarketRouters.post(`/buys`, buyController.buyByUser);
MarketRouters.post(`/buy`, buyController.buy);
MarketRouters.post(`/history`, buyController.buyByItem);
MarketRouters.post(`/check-buy`, buyController.checkBuy);
MarketRouters.post(`/validate-buys`, buyController.validateBuy);
MarketRouters.post(`/save-buy`, buyController.saveBuy);
MarketRouters.post(`/save-transfer`, buyController.saveTransfer);
MarketRouters.post(`/update-price`, buyController.updatePrice);
MarketRouters.post(`/save-sale`, buyController.saveForSale);

MarketRouters.post(`/chart-avg-ages`, chartController.chartAvgAges);
MarketRouters.post(`/chart-cnt-position`, chartController.chartCntPosition);
MarketRouters.post(`/chart-cnt-sales`, chartController.chartCntSales);

export default MarketRouters;
