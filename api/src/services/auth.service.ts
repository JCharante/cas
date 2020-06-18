import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import {User, Email, RedesignedUser, UserWithSessionKey, RedesignedUserWithPassword} from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';
import { ObjectId, MongoClient, Collection } from 'mongodb';
import BaseService from './BaseService';

class AuthService extends BaseService {
  public users = userModel;

  private async getUsersCollection(): Promise<{ client: MongoClient, usersCollection: Collection }>{
    const client = await this.getConnectedDBClient();
    const casDatabase = client.db('cas');
    const usersCollection = casDatabase.collection('users');
    return { client, usersCollection };
  }

  private async getCollections() {
    const client = await this.getConnectedDBClient();
    const casDatabase = client.db('cas');
    const usersCollection = casDatabase.collection('users');
    const sessionsCollection = casDatabase.collection('sessions');
    return { client, usersCollection, sessionsCollection };
  }

  private async getUserByEmail(email: Email): Promise<RedesignedUser | null> {
    const client = await this.getConnectedDBClient();
    const casDatabase = client.db('cas');
    const usersCollection = casDatabase.collection('users');
    const user = await usersCollection.findOne({ email });
    await client.close();
    if (user === null || !user.hasOwnProperty('email') || !user.hasOwnProperty('isAdmin')) {
      return null;
    }
    return {
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  private async getHashedPasswordForUser(userData: RedesignedUser): Promise<RedesignedUserWithPassword> {
    const { client, usersCollection } = await this.getCollections();
    const user = await usersCollection.findOne({ email: userData.email });
    const ret: RedesignedUserWithPassword = {
      email: userData.email,
      isAdmin: userData.isAdmin,
      hashedPassword: user.hashedPassword,
    };
    await client.close();
    return ret;
  }

  private async createUser(email: Email, password: string, skipChecks: boolean): Promise<RedesignedUser> {
    const { client, usersCollection } = await this.getUsersCollection();
    if (!skipChecks) {
      if ((await this.getUserByEmail(email)) !== null) {
        await client.close();
        throw new HttpException(409, `Account for ${email} exists`);
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, hashedPassword, isAdmin: false });
    await client.close();
    return {
      email,
      isAdmin: false,
    };
  }

  public async createSession(user: RedesignedUser, skipChecks: boolean): Promise<UserWithSessionKey> {
    const { client, sessionsCollection } = await this.getCollections();
    if (!skipChecks) {
      if ((await this.getUserByEmail(user.email)) === null) {
        client.close();
        throw new HttpException(400, `Account with email ${user.email} does not exist`);
      }
    }
    const { insertedId } = await sessionsCollection.insertOne({ email: user.email });
    const sessionKey : ObjectId = insertedId;
    await client.close();
    return {
      email: user.email,
      isAdmin: user.isAdmin,
      sessionKey: sessionKey.toHexString(),
    };
  }


  public async signup(userData: CreateUserDto): Promise<RedesignedUser> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    if ((await this.getUserByEmail(userData.email)) !== null) {
      throw new HttpException(409, `Account for ${userData.email} exists`);
    }

    const user = await this.createUser(userData.email, userData.password, true);

    return user;
  }

  public async login(userData: CreateUserDto): Promise<RedesignedUser> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    const findUser: RedesignedUser = await this.getUserByEmail(userData.email);
    if (findUser === null) throw new HttpException(409, `Account with email ${userData.email} not found.`);

    const user = await this.getHashedPasswordForUser(findUser);
    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, user.hashedPassword);
    if (!isPasswordMatching) throw new HttpException(409, 'Invalid Credentials');
    return findUser;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = this.users.find(user => user.password === userData.password);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
