import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    BucketListItem: a.model({
        title: a.string().required(),
        description: a.string(),
        imageUrl: a.string(),
        completed: a.boolean().required()
    })
    .authorization(allow => [allow.owner()])
});

export type Schema = typeof schema;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool'
    }
});
