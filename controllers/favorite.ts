import { verifyToken } from "../../admin/libs/jwt";
import { GetFavorites, SetFavorite } from "../business/favorite";

class FavoriteController {
  favorites = async (req: any, res: any) => {
    let { wallet, token } = req.cookies;
    let { params } = req.body;
    let { pages } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await GetFavorites(wallet, pages);
    res.status(_result.code).send(_result);
  };

  saveFavorite = async (req: any, res: any) => {
    const { wallet, token } = req.cookies;
    let { params } = req.body;
    let { product } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await SetFavorite(wallet, product);
    res.status(_result.code).send(_result);
  };
}

export default new FavoriteController();
