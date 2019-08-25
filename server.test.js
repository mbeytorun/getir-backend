const request = require("supertest");
const app = require("../app");

describe("POST /getrecords", () => {
  test("Kayit bilgilerini donmeli", async () => {
    const record = await request(app)
      .post("/getrecords")
      .send({
        "startDate": "2016-01-26",
        "endDate": "2018-02-02",
        "minCount": 2700,
        "maxCount": 3000
    });
    expect(record.body.code).toBe(0);
    expect(record.body.msg).toBe("success");
    expect(record.body).toHaveProperty("key");
    expect(record.body).toHaveProperty("totalCount");
    expect(record.statusCode).toBe(200);

    const response = await request(app).get("/getrecords");
  });
});