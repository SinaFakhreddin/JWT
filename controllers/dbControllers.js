import UserSchema from "../models/User.js";

export const dropStaleIndex = async () => {
    try {
        // Check if the index exists
        const indexes = await UserSchema.collection.indexes();
        const usernameIndex = indexes.find(index => index.name === 'username_1');

        if (usernameIndex) {
            await UserSchema.collection.dropIndex('email_1');
            console.log('✅ Stale username index dropped successfully');
        }
    } catch (error) {
        if (error.codeName === 'IndexNotFound') {
            console.log('ℹ️  username index does not exist');
        } else {
            console.log('⚠️  Error dropping index:', error.message);
        }
    }
};