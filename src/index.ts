import "reflect-metadata";
import {ApolloServer} from "apollo-server-express";
import * as Express from "express";
import {buildSchema, Resolver, Query, Field, ObjectType, ID, FieldResolver, Root, Arg } from "type-graphql";

@ObjectType()
class Greeting {
    @Field(() => ID, {nullable: false})
    readonly value : string;
    constructor(value : string) {
        this.value = value;
    }
    @Field()
    readonly sentence : string;
}

const greetings = new Map<string, Greeting>();
greetings.set("da", new Greeting("Hej"));
greetings.set("fr", new Greeting("Bonjour"));
greetings.set("en", new Greeting("Hello"));
/* 
class GetGreetingArgs {
    @Field()
    lang : string;
}
*/

@Resolver()
class HelloResolver {
    @Query(() => String, {name: "hellolekkim", description: "Says hello to lekkim", nullable: false})
    async hello() {
        return "Hello, lekkim, World!!!";
    }
}

@Resolver(Greeting)
class GreetingResolver {
    @FieldResolver()
    async sentence(@Root() parent : Greeting) {
        return `${parent.value} World!`;
    }

    @Query(() => Greeting)
    async greeting(@Arg("lang") lang : string) {
        return greetings.get(lang);
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [HelloResolver, GreetingResolver]
    })

    if (process.env.NODE_ENV === undefined || process.env.GRAPHQL_ENABLE_PLAYGROUND !== undefined) {
        console.log("Enabling GraphQL Playground");
    }
    const apolloServer = new ApolloServer({ 
        schema, 
        introspection: process.env.NODE_ENV === undefined || process.env.GRAPHQL_ENABLE_PLAYGROUND !== undefined,
        playground: process.env.NODE_ENV === undefined || process.env.GRAPHQL_ENABLE_PLAYGROUND !== undefined 
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
