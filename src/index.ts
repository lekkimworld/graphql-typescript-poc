import "reflect-metadata";
import {ApolloServer} from "apollo-server-express";
import * as Express from "express";
import {buildSchema, Resolver, Query} from "type-graphql";

@Resolver()
class HelloResolver {
    @Query(() => String, {name: "hellolekkim", description: "Says hello to lekkim", nullable: false})
    async hello() {
        return "Hello, lekkim, World!!!";
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [HelloResolver]
    })

    const apolloServer = new ApolloServer({ 
        schema, 
        playground: process.env.GRAPHQL_ENABLE_PLAYGROUND !== undefined 
    });
    const app = Express();
    apolloServer.applyMiddleware({
        "app": app
    });

    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server now listening on http://localhost:${process.env.PORT || 4000}/graphql`);
    })
}

main();
