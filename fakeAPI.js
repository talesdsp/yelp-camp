import User from "./src/models/user";

export default async function createFakeData(faker, fs) {
  try {
    let user = await iterator(userData, 2);

    await User.insertMany(user);

    let campground = [];
    await iterator(campData, 2, user);

    let comment = [];
    await iterator(commentData, 3, user);

    async function iterator(fn, n, user = [], arr = []) {
      const promises = [...Array(n)].map((i) => fn(user));
      return await Promise.all(promises);
    }

    async function getId(index) {
      const sei = await User.findOne({email: user[index].email});
      return sei;
    }

    function userData(_user) {
      return {
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        createdAt: faker.date.recent()
      };
    }

    async function campData(user) {
      try {
        let index = Math.floor(Math.random() * user.length);
        const {id} = await getId(index);

        const obj = {
          name: faker.name.title(),
          image: faker.image.nature(),
          description: faker.lorem.lines(2),
          cost: faker.finance.amount(),
          location: faker.address.city(),
          lat: faker.address.latitude(),
          lng: faker.address.longitude(),
          createdAt: faker.date.recent(),
          author: {
            id,
            username: user[index].username
          },
          comments: []
        };
        campground.push(obj);
      } catch {}
    }

    async function commentData(user) {
      try {
        let index = Math.floor(Math.random() * user.length);
        const {id} = await getId(index);
        const obj = {
          text: faker.lorem.lines(1),
          createdAt: faker.date.recent(),
          author: {
            id,
            username: user[index].username
          }
        };
        comment.push(obj);
      } catch {}
    }

    fs.writeFile("fakeApi.json", JSON.stringify({user, campground, comment}), () => {});
    return {user, campground, comment};
  } catch (err) {
    console.log("banana");
    console.log(err);
  }
}
