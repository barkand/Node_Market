import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

import server from "../../../server";
const system = "market";

describe("Market", () => {
  it("GetGroups", (done) => {
    let data = { params: { lang: "en" } };

    chai
      .request(server)
      .post(`/api/${system}/get-groups`)
      .set("content-type", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.body.code).equal(200);
        expect(res.body.groups).length.greaterThan(0);
        expect(res).to.have.status(200);
        done();
      });
  });
});
