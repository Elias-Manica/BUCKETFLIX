import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { prisma } from "../../src/database/database";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

import jwt from "jsonwebtoken";

import { createUser } from "../factories/user.factory";
import { generateValidToken } from "../factories/session.factory";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("POST /add-movie", () => {
  const generateValidBody = () => ({
    movieid: 550,
    apiKey: "282f0a136717fde5f2065214b2d08a25",
  });

  const invalidBodyMovieID = () => ({
    movieid: 55000000,
    apiKey: "282f0a136717fde5f2065214b2d08a25",
  });

  const invalidBodyAPIKEY = () => ({
    movieid: 550,
    apiKey: "123",
  });
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.post("/add-movie");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .post("/add-movie")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const body = generateValidBody();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET
    );

    const response = await api
      .post("/add-movie")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 422 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/add-movie")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("Should respond with status 422 when body is not valid", async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const token = await generateValidToken();

      const response = await api
        .post("/add-movie")
        .send(invalidBody)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("When body is valid", () => {
      it("should respond with status 404 when there is no movie in API movies with that movieid", async () => {
        const body = invalidBodyMovieID();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 401 when the api key send is not valid", async () => {
        const body = invalidBodyAPIKEY();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 201 and return id and movieid when body is valid", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({
          id: expect.any(Number),
          movieid: body.movieid,
        });
      });

      it("should save movie on db", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        const movie = await prisma.movies.findUnique({
          where: { movieid: body.movieid },
        });
        expect(movie).toEqual(
          expect.objectContaining({
            id: response.body.id,
            movieid: body.movieid,
          })
        );
      });
    });
  });
});