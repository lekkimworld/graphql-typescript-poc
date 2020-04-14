import "reflect-metadata";
import {ApolloServer} from "apollo-server-express";
import Express from "express";
import {Length} from "class-validator";
import {buildSchema, Resolver, Query, Field, ObjectType, ID, FieldResolver, Root, Arg, InputType, Mutation } from "type-graphql";

@InputType()
class GreetingInput {
    @Field()
    @Length(2, 2)
    lang : string;

    @Field()
    @Length(2)
    value : string;
}

@ObjectType()
class Greeting {
    @Field(() => ID, {nullable: false})
    readonly lang : string;
    
    @Field(() => String, {nullable: false})
    readonly value : string;
    
    @Field()
    readonly sentence : string;

    constructor(lang : string, value : string) {
        this.lang = lang;
        this.value = value;
    }
}

const greetings = new Map<string, Greeting>();
greetings.set("de", new Greeting("de", "Servus"));
greetings.set("fr", new Greeting("fr", "Bonjour"));
greetings.set("en", new Greeting("en", "Hello"));

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

    @Query(() => Greeting, {nullable: true})
    async greeting(@Arg("lang") lang : string) {
        return greetings.get(lang);
    }

    @Query(() => [Greeting])
    async greetings() {
        return Promise.resolve(greetings.values());
    }

    @Mutation(() => Greeting)
    async create(@Arg("data") {lang, value} : GreetingInput): Promise<Greeting> {
        const g = new Greeting(lang, value);
        greetings.set(lang, g);
        return Promise.resolve(g);
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [HelloResolver, GreetingResolver]
    })
    
    const enablePlayground = process.env.NODE_ENV === "development" || process.env.GRAPHQL_ENABLE_PLAYGROUND !== undefined;
    if (enablePlayground) {
        console.log("Enabling GraphQL Playground");
    }
    const apolloServer = new ApolloServer({ 
        schema, 
        "introspection": enablePlayground,
        "playground": enablePlayground
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
