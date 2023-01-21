import { cacheDb } from "../../../core";

const GetCacheGroups = async (lang: string) => {
  let _teams: any = await cacheDb.get(`teams${lang}`);
  if (_teams) _teams = JSON.parse(_teams);
  return _teams;
};
const SetCacheGroups = async (lang: string, teams: any) => {
  await cacheDb.set(`teams${lang}`, JSON.stringify(teams));
};

export { GetCacheGroups, SetCacheGroups };
