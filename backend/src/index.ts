import koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from '@koa/cors';
import { prisma } from "./integrations";
import { logger } from "./utils";
import routes from './routes';
import { logging, catcher, locale } from "./middleware";

const main = async () => {
  const app = new koa();

  await prisma.$connect();
  logger.info(`💾 Prisma connected (${process.env.DATABASE_URL})`);

  app.use(helmet());
  app.use(cors());
  app.use(bodyParser());

  app.use(locale());

  // Preserve order!
  app.use(catcher);
  app.use(logging);

  // Routes
  app
    .use(routes.routes())
    .use(routes.allowedMethods())
    .use(routes.middleware())

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    logger.info(`🚀 Server listening on port ${port}`);
  });

  process.on("SIGTERM", () => {
    prisma.$disconnect();
  });
};

main();
