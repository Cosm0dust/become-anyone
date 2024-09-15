import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostsModule } from "./post/posts.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { CustomCacheModule } from "./cache/custom-cache.module";
import { PubSubModule } from "./pub-sub/pub-sub.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DATABASE_HOST"),
        port: config.get<number>("DATABASE_PORT"),
        username: config.get<string>("DATABASE_USERNAME"),
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        migrations: ["dist/migrations/migrations/*{.ts,.js}"],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/graphql-schema.gql"),
      playground: true,
      sortSchema: true,
      subscriptions: {
        "subscriptions-transport-ws": {
          path: "/graphql",
        },
      },
    }),
    UserModule,
    AuthModule,
    PostsModule,
    CustomCacheModule.forRoot(),
    PubSubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
