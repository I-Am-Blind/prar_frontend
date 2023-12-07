export const userSchema= {
    version: 0,
    primaryKey: 'username',
    type: 'object',
    properties: {
        // id: {
        //     type: 'string',
        //     maxLength: 100 // <- the primary key must have set maxLength
        // },
        username: {
            type: 'string',
            maxLength: 100
        },
        pin: {
            type: 'boolean'
        }
    },
    required: ['username', 'pin', ]
}