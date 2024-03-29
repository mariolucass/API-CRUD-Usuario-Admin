import users from "../database";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";


export const createUser = async ({ email, password, name, isAdm }) => {
  const userFound = users.find((elem) => elem.email === email);
  if (userFound) {
    return [409, { message: "E-mail already registered." }];
  }

  const newUser = {
    uuid: uuidv4(),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    createdOn: new Date(),
    updatedOn: new Date(),
    isAdm,
  };
  users.push(newUser);

  const responseUser = {
    uuid: newUser.uuid,
    name,
    email,
    createdOn: new Date(),
    updatedOn: new Date(),
    isAdm,
  };

  return [201, responseUser];
};

export const loginUser = async ({ email, password }) => {
  const user = users.find((elem) => elem.email === email);
  if (!user) {
    return [404, { message: "Wrong email/password" }];
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return [401, { message: "Wrong email/password" }];
  }

  const token = jwt.sign({}, process.env.SECRET_KEY, {
    expiresIn: "24h",
    subject: user.uuid,
  });

  return [200, { token }];
};


export const listUsers = async () => {
  return [200, users];
};

export const deleteUser = async ({ index }) => {
  users.splice(index, 1);

  return [204, {}];
};


export const listUser = async (index) => {
  let user = users[index];
  const { uuid, name, email, createdOn, updatedOn, isAdm } = user;
  const userReturn = {
    uuid,
    name,
    email,
    createdOn,
    updatedOn,
    isAdm,
  };
  return [200, userReturn];
};

export const updateUser = async (index, body) => {
  for (const key in body) {
    if (
      key === "isAdm" ||
      key === "uuid" ||
      key === "createdOn" ||
      key === "updatedOn"
    ) {
    } else {
      users[index][key] = body[key];
    }
  }

  users[index].updatedOn = new Date();

  let user = users[index];
  const { uuid, name, email, createdOn, updatedOn, isAdm } = user;
  const userReturn = {
    uuid,
    name,
    email,
    createdOn,
    updatedOn,
    isAdm,
  };

  return [200, userReturn];
};
