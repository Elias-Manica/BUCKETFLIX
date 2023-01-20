import { Request, Response, NextFunction } from "express";

import httpStatus from "http-status";

import { createUserSchema } from "../schemas/user.schema";

import userRepository from "../repositories/users.repository";

async function signUpIsValid(req: Request, res: Response, next: NextFunction) {
  const isValid = createUserSchema.validate(req.body, { abortEarly: false });

  if (isValid.error) {
    const error = isValid.error.details.map((erro) => erro.message);
    res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
    return;
  }

  next();
}

async function hadEmailUnique(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const response = await userRepository.hasUserWithEmail(email);

    if (response) {
      res.status(httpStatus.CONFLICT).send({ msg: "E-mail já registrado" });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Erro interno no servidor" });
  }
}

export { signUpIsValid, hadEmailUnique };
