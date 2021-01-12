const faker = require('faker');

const {test_blueform, development} = require('./model/user');
const {develop, testblueform} = require('./connections');

async function seed() {
    for (let i = 0; i< 10; i++) {
        await test_blueform.create({
            name: faker.name.findName(),
            isActive: faker.random.boolean(),
        });
    }

    for (let i = 0; i < 10; i++) {
        await development.create({
            title: faker.lorem.words(3),
            completed: faker.random.boolean(),
        });
    }
}

seed().then(() => {
    develop.close();
    testblueform.close();
});