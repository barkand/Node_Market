import { verifyToken } from "../../admin/libs/jwt";
import { GetFavorites, SetFavorite } from "../business/favorite";

class FavoriteController {
  favorites = async (req: any, res: any) => {
    let { user_id, token } = req.cookies;
    let { params } = req.body;
    let { pages } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result = await GetFavorites(user_id, pages);
    res.status(_result.code).send(_result);
  };

  saveFavorite = async (req: any, res: any) => {
    const { user_id, token } = req.cookies;
    let { params } = req.body;
    let { product } = params;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result = await SetFavorite(user_id, product);
    res.status(_result.code).send(_result);
  };
}

export default new FavoriteController();
