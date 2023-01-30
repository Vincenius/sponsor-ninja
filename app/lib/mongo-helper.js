import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.p6yfpiv.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const connectDb = () => client.connect()
const disconnectDb = () => setTimeout(() => { client.close() }, 5000)

const getUserByQuery = async query => {
  let result = []

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_USER_COLLECTION)

    result = await collection.find(query).toArray()
  } catch (e) {
    console.log('error on getting user', e)
  }

  return result
}

const createUser = async newUser => {
  let result

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_USER_COLLECTION)

    result = await collection.insertOne(newUser)
  } catch (e) {
    console.log('error on creating user', e)
  }

  return result
}

const updateUserByQuery = async ({ query, update }) => {
  let result

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_USER_COLLECTION)

    result = await collection.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after' })
  } catch (e) {
    console.log('error on updating user', e)
  }

  return result
}

const createProject = async newProject => {
  let result

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_PROJECT_COLLECTION)

    result = await collection.insertOne(newProject)
  } catch (e) {
    console.log('error on creating user', e)
  }

  return result
}

const getProjectByQuery = async query => {
  let result = []

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_PROJECT_COLLECTION)

    result = await collection.find(query).toArray()
  } catch (e) {
    console.log('error on getting user', e)
  }

  return result
}

const createDonation = async newDonation => {
  let result

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_DONATION_COLLECTION)

    result = await collection.insertOne(newDonation)
  } catch (e) {
    console.log('error on creating user', e)
  }

  return result
}

const getDonationByQuery = async query => {
  let result = []

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_DONATION_COLLECTION)

    result = await collection.find(query).toArray()
  } catch (e) {
    console.log('error on getting user', e)
  }

  return result
}

const updateDonationByQuery = async ({ query, update }) => {
  let result

  try {
    const db = client.db(process.env.MONGODB_DATABASE)
    const collection = db.collection(process.env.MONGODB_DONATION_COLLECTION)

    result = await collection.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after' })
  } catch (e) {
    console.log('error on updating user', e)
  }

  return result
}

const mongoHelper = {
  connectDb,
  disconnectDb,

  getUserByQuery,
  createUser,
  updateUserByQuery,

  createProject,
  getProjectByQuery,

  createDonation,
  getDonationByQuery,
  updateDonationByQuery,
}

export default mongoHelper
