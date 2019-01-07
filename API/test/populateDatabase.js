const clearDB = require('./graphql/clearDB');
const usersServices = require('../src/graphql/services/users.services');
const postsServices = require('../src/graphql/services/posts.services');

let tabUsers;
let tabPosts;

const populateDB = async() => {
  await clearDB();

  // ------------------------------------------------------------------- ajout de 2 users ----------------------------------------------------------------------
  const user1 = await usersServices.addUser(
    {
      firstname: 'Benoît',
      lastname: 'Schöpfli',
      email: 'benoit@schopfli.ch',
      password: '1234abcd'
    }
  );

  const user2 = await usersServices.addUser(
    {
      firstname: 'Antoine',
      lastname: 'Rochaille',
      email: 'antoine@rochaille.ch',
      password: '1234abcd'
    }
  );

  const user3 = await usersServices.addUser(
    {
      firstname: 'Paul',
      lastname: 'Ntawuruquelquechosedugenre',
      email: 'paul@nta.ch',
      password: '1234abcd'
    }
  );

  const user4 = await usersServices.addUser(
    {
      firstname: 'Miguel',
      lastname: 'SantaClause',
      email: 'miguel@santaclause.ch',
      password: '1234abcd'
    }
  );

  const post1u1 = await postsServices.addPostOfUser({
    userId: user1.id,
    text: `Ceci est un post créé par ${user1.firstname} ${user1.lastname}.`
  });

  const post2u1 = await postsServices.addPostOfUser({
    userId: user1.id,
    text: `Ceci est un autre post créé par ${user1.firstname} ${user1.lastname}.`
  });

  const post1u2 = await postsServices.addPostOfUser({
    userId: user2.id,
    text: `Ceci est un post créé par ${user2.firstname} ${user2.lastname}.`
  });

  const post1u3 = await postsServices.addPostOfUser({
    userId: user3.id,
    text: `Ceci est un post créé par ${user3.firstname} ${user3.lastname}.`
  });

  // ------------------------------------------------------------------------- tableaux ------------------------------------------------------------------------
  // on regroupe chaque élément dans des tableaux pour les tests d'intégration
  tabUsers = [user1, user2, user3, user4];

  tabPosts = [post1u1, post2u1, post1u2, post1u3];
};

it('should populate the database!', populateDB);

module.exports = {
  populateDB,
  getTabUsers: () => tabUsers,
  getTabPosts: () => tabPosts
};
