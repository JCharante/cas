import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, Lock, TokenData } from '../interfaces/auth.interface';
import { User, Email, RedesignedUser, RedesignedUserWithPassword } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';
import { MongoClient, Collection } from 'mongodb';
import BaseService from './BaseService';
import { v4 as uuidv4 } from 'uuid';
import { UserWithSessionKey } from 'types-cas';

class AuthService extends BaseService {
  public users = userModel;

  private async getCollections() {
    const client = await this.getConnectedDBClient();
    const casDatabase = client.db('cas');
    const usersCollection = casDatabase.collection('users');
    const sessionsCollection = casDatabase.collection('sessions');
    const locksCollection = casDatabase.collection('locks');
    return { client, usersCollection, sessionsCollection, locksCollection };
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

  private async acquireLock(lockName: string, locksCollection: Collection): Promise<Lock> {
    let lock: Lock | null = await locksCollection.findOne({ name: 'createUser' });
    const agent = uuidv4();
    let confirms: number = 0;
    while (confirms < 2) {
      if (lock === null || new Date() > lock.expiresOn) {
        const expiresOn = new Date();
        const timeOutSeconds = 9;
        expiresOn.setSeconds(expiresOn.getSeconds() + timeOutSeconds);
        await locksCollection.updateOne(
          { name: lockName },
          { $set: { expiresOn, agent } },
          { upsert: true });
      }
      lock = await locksCollection.findOne({ name: lockName });
      if (lock.agent === agent) {
        confirms += 1;
      }
      const sleep = require('sleep-async')().Promise;
      await sleep.sleep(100);
    }
    return lock;
  }

  private async releaseLock(lockName: string, locksCollection: Collection): Promise<void> {
    // let lock: Lock | null = await locksCollection.findOne({ name: lockName });
    const expiresOn: Date = new Date(0);
    await locksCollection.updateOne({ name: lockName }, { $set: { expiresOn } });
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

  private async createUser(email: Email, password: string, skipChecks: boolean = false): Promise<RedesignedUser> {
    const { client, usersCollection, locksCollection } = await this.getCollections();
    if (!skipChecks) {
      // easy async case
      if ((await this.getUserByEmail(email)) !== null) {
        await client.close();
        throw new HttpException(409, `Account for ${email} exists`);
      }
      // get the lock
      await this.acquireLock('createUser', locksCollection);
      // do another check
      if ((await this.getUserByEmail(email)) !== null) {
        // let go of lock
        await this.releaseLock('createUser', locksCollection);
        await client.close();
        throw new HttpException(409, `Account for ${email} exists`);
      }
    }
    // create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, hashedPassword, isAdmin: false });
    // let go of lock
    await this.releaseLock('createUser', locksCollection);
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
    const sessionKey : string = uuidv4();
    await sessionsCollection.insertOne({ sessionKey, email: user.email });
    await client.close();
    return {
      sessionKey,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  public async signup(userData: CreateUserDto): Promise<RedesignedUser> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    if ((await this.getUserByEmail(userData.email)) !== null) {
      throw new HttpException(409, `Account for ${userData.email} exists`);
    }

    const user = await this.createUser(userData.email, userData.password, false);

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
