const clearDB = require('./graphql/clearDB');
const usersServices = require('../src/graphql/services/users.services');

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
      password: '1234abcd',
      watchlist: ['5c37512c64084899fa7bcc4b', '5c37512c64084899fa7bcc4c']
    }
  );

  const user2 = await usersServices.addUser(
    {
      firstname: 'Antoine',
      lastname: 'Rochaille',
      email: 'antoine@rochaille.ch',
      password: '1234abcd',
      watchlist: ['5c37512c64084899fa7bcc4d']
    }
  );

  const user3 = await usersServices.addUser(
    {
      firstname: 'Paul',
      lastname: 'Ntawuruquelquechosedugenre',
      email: 'paul@nta.ch',
      password: '1234abcd',
      watchlist: []
    }
  );

  const user4 = await usersServices.addUser(
    {
      firstname: 'Miguel',
      lastname: 'SantaClause',
      email: 'miguel@santaclause.ch',
      password: '1234abcd',
      watchlist: ['5c37512c64084899fa7bcc4e']
    }
  );

  // ------------------------------------------------------------------------- tableaux ------------------------------------------------------------------------
  // on regroupe chaque élément dans des tableaux pour les tests d'intégration
  tabUsers = [user1, user2, user3, user4];
  console.log(user1);
};

it('should populate the database!', populateDB);

module.exports = {
  populateDB,
  getTabUsers: () => tabUsers,
};
