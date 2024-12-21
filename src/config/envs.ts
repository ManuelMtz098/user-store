import 'dotenv/config';
import { get } from 'env-var'

export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SECRET_KEY: get('JWT_SECRET_KEY').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').required().asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  WEB_sERVICE: get('WEB_SERVICE').required().asString(),
}