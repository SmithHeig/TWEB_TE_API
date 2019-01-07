const bcrypt = require('bcrypt');
const personsServices = require('../../../src/graphql/services/persons.services');
const producersServices = require('../../../src/graphql/services/producers.services');
const productsServices = require('../../../src/graphql/services/products.services');
const productTypeServices = require('../../../src/graphql/services/productTypes.services');
const usersServices = require('../../../src/graphql/services/users.services');
const clearDB = require('../clearDB');
const { populateDB } = require('../../populateDatabase');

let producers = [];
let users = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  users = await usersServices.getUsers();
  users = users.map(u => u.toObject());
  producers = await producersServices.getProducers();
  producers = producers.map(p => p.toObject());
};

describe('tests users services', () => {
  beforeEach(() => clearAndPopulateDB());


  describe('tests isEmailAvailable', () => {
    it('should return false because this email is already used', async() => {
      let res = await personsServices.isEmailAvailable(users[0].email);
      res.should.be.false;

      res = await personsServices.isEmailAvailable(producers[0].email);
      res.should.be.false;
    });

    it('should return true because this email is not used', async() => {
      const res = await personsServices.isEmailAvailable('coucou@payouz.ch');
      res.should.be.true;
    });
  });

  describe('tests checkIfPersonIdExistInDB', () => {
    it('should return true because this user is in th DB', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(users[0].id);
      personIsInDB.should.be.true;
    });

    it('should return true because this producer is in th DB (without check if it is really a producer)', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(producers[0].id);
      personIsInDB.should.be.true;
    });

    it('should return true because this producer is in th DB and it is really a producer', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(producers[0].id, true);
      personIsInDB.should.be.true;

      producers[0].kind.should.be.equal('producers');
    });

    it('should return false because the received id is not a producer\'s id', async() => {
      const personIsInDB = await personsServices.checkIfPersonIdExistInDB(users[0].id, true);
      personIsInDB.should.be.false;

      users[0].kind.should.be.equal('users');
    });

    it('should return false because the received id is an unknown id', async() => {
      let personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcdefabcdefabcdefabcdef');
      personIsInDB.should.be.false;

      personIsInDB = await personsServices.checkIfPersonIdExistInDB('abcdefabcdefabcdefabcdef', true);
      personIsInDB.should.be.false;
    });

    it('should return false because no id received', async() => {
      try {
        await personsServices.checkIfPersonIdExistInDB('');
      } catch (err) {
        err.message.should.be.equal('Received personId is invalid!');
      }
      try {
        await personsServices.checkIfPersonIdExistInDB('', true);
      } catch (err) {
        err.message.should.be.equal('Received personId is invalid!');
      }
    });

    it('should return false because invalid id received', async() => {
      try {
        await personsServices.checkIfPersonIdExistInDB('abcedf'); // id trop court (< 24 caractères)
      } catch (err) {
        err.message.should.be.equal('Received personId is invalid!');
      }
      try {
        await personsServices.checkIfPersonIdExistInDB('abcedf', true); // id trop court (< 24 caractères)
      } catch (err) {
        err.message.should.be.equal('Received personId is invalid!');
      }

      try {
        await personsServices.checkIfPersonIdExistInDB('abcedfabcedfabcedfabcedfabcedf'); // id trop long (> 24 caractères)
      } catch (err) {
        err.message.should.be.equal('Received personId is invalid!');
      }
      try {
        await personsServices.checkIfPersonIdExistInDB('abcedfabcedfabcedfabcedfabcedf', true); // id trop long (> 24 caractères)
      } catch (err) {
        err.message.should.be.equal('Received personId is invalid!');
      }
    });
  });

  describe('tests getPersonById', () => {
    it('should get one person (user)', async() => {
      // on récupère la personne corresondant à l'id donné
      const user = (await personsServices.getPersonById(users[0].id)).toObject();

      // on test son contenu

      // on test son contenu
      expect(user).to.be.not.null;
      expect(user.id).to.be.eql(users[0].id);
      expect(user.firstname).to.be.equal(users[0].firstname);
      expect(user.lastname).to.be.equal(users[0].lastname);
      expect(user.email).to.be.equal(users[0].email);
      expect(user.password).to.be.equal(users[0].password);
      expect(user.image).to.be.equal(users[0].image);
      expect(user.kind).to.be.equal('users');

      expect(user.followingProducersIds).to.be.an('array');
      expect(user.followingProducersIds.length).to.be.equal(users[0].followingProducersIds.length);

      expect(user.emailValidated).to.be.equal(users[0].emailValidated);
    });

    it('should get one person (producer)', async() => {
      // on récupère la personne corresondant à l'id donné
      const producer = (await personsServices.getPersonById(producers[0].id)).toObject();

      // on test son contenu
      producer.should.be.not.null;
      producer.id.should.be.eql(producers[0].id);
      producer.firstname.should.be.equal(producers[0].firstname);
      producer.lastname.should.be.equal(producers[0].lastname);
      producer.email.should.be.equal(producers[0].email);
      producer.password.should.be.equal(producers[0].password);
      producer.image.should.be.equal(producers[0].image);
      producer.followingProducersIds.should.be.an('array');
      producer.followingProducersIds.length.should.be.equal(producers[0].followingProducersIds.length);
      producer.emailValidated.should.be.equal(producers[0].emailValidated);
      producer.followersIds.should.be.an('array');
      producer.followersIds.length.should.be.equal(producers[0].followersIds.length);
      producer.phoneNumber.should.be.equal(producers[0].phoneNumber);
      producer.description.should.be.equal(producers[0].description);
      producer.website.should.be.equal(producers[0].website);
      expect(producer.salespointId).to.be.eql(producers[0].salespointId);
      producer.isValidated.should.be.equal(producers[0].isValidated);

      // on test le tableau productsIds et son contenu
      const promisesTestsProductsIds = producer.productsIds.map((async(productId, index) => {
        productId.toString().should.be.equal(producers[0].productsIds[index].toString());

        // on récupère les infos du produit correspondant
        const product = (await productsServices.getProductById(productId)).toObject();

        // on récupère les infos du productType correspondant au produit
        const productType = (await productTypeServices.getProductTypeById(product.productTypeId)).toObject();
        productType.should.be.not.null;
        productType.producersIds.should.be.not.null;
        const addedProducerId = producer.id.toString();

        // on vérifie que l'id du producteur ait bien été ajouté dans le tableau 'productersIds' du productType
        const filtredTab = await productType.producersIds.filter(elem => elem.toString() === addedProducerId);
        filtredTab.length.should.be.equal(1);
      }));
      await Promise.all(promisesTestsProductsIds);
    });

    it('should fail getting one person because no id received', async() => {
      try {
        await personsServices.getPersonById('');
      } catch (err) {
        err.message.should.be.equal('Received person.id is invalid!');
      }
    });

    it('should fail getting one person because invalid id received', async() => {
      try {
        await personsServices.getPersonById(users[0].id + users[0].id);
      } catch (err) {
        err.message.should.be.equal('Received person.id is invalid!');
      }
    });

    it('should fail getting one person because unknown id received', async() => {
      const personGotInDB = await personsServices.getPersonById('abcdefabcdefabcdefabcdef');
      expect(personGotInDB).to.be.null;
    });
  });

  describe('tests getAllPersonsInReceivedIdList', () => {
    it('should get all persons with id in received list', async() => {
      // on récupère 3 personnes dans la DB
      let persons = await personsServices.getAllPersonsInReceivedIdList([users[0].id, users[1].id, producers[0].id]);
      persons.should.be.an('array');
      persons.length.should.be.equal(3);

      // on récupère 2 utilisateurs
      persons = await personsServices.getAllPersonsInReceivedIdList([users[0].id, producers[0].id]);
      persons.should.be.not.null;
      persons.should.be.an('array');
      persons.length.should.be.equal(2);

      // on récupère aucun utilisateur
      persons = await personsServices.getAllPersonsInReceivedIdList([]);
      persons.should.be.not.null;
      persons.should.be.an('array');
      persons.length.should.be.equal(0);
    });
  });

  describe('tests addProducerToPersonsFollowingList', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add only once a producer to the followingProducersIds list of a person', async() => {
      // on récupère une personne dans la DB
      let user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      // on ajoute un producteur à la liste de producteurs suivis de cet utilisateur
      user = (await personsServices.addProducerToPersonsFollowingList(user.id, producers[0].id)).toObject();

      expect(user.followingProducersIds.length).to.be.equal(1);
      expect(user.followingProducersIds[0].toString()).to.be.equal(producers[0].id);

      // on ajoute le même producteur à la liste de producteurs suivis de cet utilisateur -> il ne doit pas être ajouté une 2ème fois
      user = (await personsServices.addProducerToPersonsFollowingList(user.id, producers[0].id)).toObject();

      expect(user.followingProducersIds.length).to.be.equal(1);
      expect(user.followingProducersIds[0].toString()).to.be.equal(producers[0].id);
    });

    it('should not add a user to the followingProducersIds list of a person', async() => {
      // on récupère une personne dans la DB
      let user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      // on ajoute un utilisateur à la liste de producteurs suivis de cet utilisateur
      try {
        user = await personsServices.addProducerToPersonsFollowingList(user.id, users[1].id);
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal(`The given person (with id: ${users[1].id}) is not a producer! You can only follow the producers.`);
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because it\'s yourself!', async() => {
      // on récupère une personne dans la DB
      let user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      // on ajoute un utilisateur à la liste de producteurs suivis de cet utilisateur
      try {
        user = await personsServices.addProducerToPersonsFollowingList(user.id, users[0].id);
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('You can\'t follow yourself!');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because invalid personId received!', async() => {
      try {
        // on ajoute producteur à la liste de producteurs suivis d'un utilisateur avec un id invalide (trop court)
        await personsServices.addProducerToPersonsFollowingList('abcdef', producers[0].id); // personId too short
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because invalid personId received!', async() => {
      try {
        // on ajoute producteur à la liste de producteurs suivis d'un utilisateur avec un id invalide (trop long)
        await personsServices.addProducerToPersonsFollowingList('abcdefabcdefabcdefabcdefabcdef', producers[0].id); // personId too long
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because unknow personId received!', async() => {
      // on ajoute un producteur à la liste de producteurs suivis d'un utilisateur avec un id inconnu (pas dans la DB)
      const user = await personsServices.addProducerToPersonsFollowingList('abcdefabcdefabcdefabcdef', producers[0].id); // personId too long
      expect(user).to.be.null;
    });


    it('should not add a producer to the followingProducersIds list of a person because invalid producerId received!', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      try {
        // on ajoute un producteur avec un id invalide (trop court) à la liste de producteurs suivis d'un utilisateur
        await personsServices.addProducerToPersonsFollowingList(user.id, 'abcdef'); // producerId too short
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because invalid producerId received!', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      try {
        // on ajoute un producteur avec un id invalide (trop long) à la liste de producteurs suivis d'un utilisateur
        await personsServices.addProducerToPersonsFollowingList(user.id, 'abcdefabcdefabcdefabcdefabcdef'); // personId too long
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because unknow producerId received!', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      try {
        // on ajoute un producteur à la liste de producteurs suivis d'un utilisateur avec un id inconnu (pas dans la DB)
        await personsServices.addProducerToPersonsFollowingList(user.id, 'abcdefabcdefabcdefabcdef'); // personId too long
      } catch (err) {
        expect(err.message).to.be.equal('The given person (with id: abcdefabcdefabcdefabcdef) doesn’t exist in the database!');
      }
    });
  });

  describe('tests removeProducerToPersonsFollowingList', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should remove a producer from the followingProducersIds list of a person', async() => {
      // on récupère une personne dans la DB
      let user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      // on ajoute un producteur à la liste de producteurs suivis de cet utilisateur
      user = (await personsServices.addProducerToPersonsFollowingList(user.id, producers[0].id)).toObject();

      expect(user.followingProducersIds.length).to.be.equal(1);
      expect(user.followingProducersIds[0].toString()).to.be.equal(producers[0].id);

      // on supprime un producteur de la liste de producteurs suivis de cet utilisateur
      user = (await personsServices.removeProducerToPersonsFollowingList(user.id, producers[0].id)).toObject();

      expect(user.followingProducersIds.length).to.be.equal(0);
    });


    it('should not remove a producer to the followingProducersIds list of a person because invalid personId received!', async() => {
      try {
        // on ajoute producteur à la liste de producteurs suivis d'un utilisateur avec un id invalide (trop court)
        await personsServices.addProducerToPersonsFollowingList('abcdef', producers[0].id); // personId too short
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because invalid personId received!', async() => {
      try {
        // on ajoute producteur à la liste de producteurs suivis d'un utilisateur avec un id invalide (trop long)
        await personsServices.addProducerToPersonsFollowingList('abcdefabcdefabcdefabcdefabcdef', producers[0].id); // personId too long
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because unknow personId received!', async() => {
      // on ajoute un producteur à la liste de producteurs suivis d'un utilisateur avec un id inconnu (pas dans la DB)
      const user = await personsServices.addProducerToPersonsFollowingList('abcdefabcdefabcdefabcdef', producers[0].id); // personId too long
      expect(user).to.be.null;
    });


    it('should not add a producer to the followingProducersIds list of a person because invalid producerId received!', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      try {
        // on ajoute un producteur avec un id invalide (trop court) à la liste de producteurs suivis d'un utilisateur
        await personsServices.addProducerToPersonsFollowingList(user.id, 'abcdef'); // producerId too short
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because invalid producerId received!', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      try {
        // on ajoute un producteur avec un id invalide (trop long) à la liste de producteurs suivis d'un utilisateur
        await personsServices.addProducerToPersonsFollowingList(user.id, 'abcdefabcdefabcdefabcdefabcdef'); // personId too long
      } catch (err) {
        // lève une erreur car on ne peut suivre que des producteurs!
        expect(err.message).to.be.equal('Cast to ObjectId failed for value "abcdefabcdefabcdefabcdefabcdef" at path "_id" for model "persons"');
      }
    });

    it('should not add a producer to the followingProducersIds list of a person because unknow producerId received!', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // sa liste de followingProducers est vide
      expect(user.followingProducersIds).to.be.null;

      try {
        // on ajoute un producteur à la liste de producteurs suivis d'un utilisateur avec un id inconnu (pas dans la DB)
        await personsServices.addProducerToPersonsFollowingList(user.id, 'abcdefabcdefabcdefabcdef'); // personId too long
      } catch (err) {
        expect(err.message).to.be.equal('The given person (with id: abcdefabcdefabcdefabcdef) doesn’t exist in the database!');
      }
    });
  });


  describe('tests changePassword', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should change the password of a person', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // on check son password
      let match = await bcrypt.compare(user.password, users[0].password);
      expect(match).to.be.true;

      const pwdModified = (await personsServices.changePassword('newPassword1234', '1234abcd', user.id));
      expect(pwdModified).to.be.true;

      // on check son password
      match = await bcrypt.compare('newPassword1234', user.password);
      expect(match).to.be.true;
    });

    it('should not change the password of a person because wrong oldPassword', async() => {
      // on récupère une personne dans la DB
      const user = (await personsServices.getPersonById(users[0].id)).toObject();
      // on check son password
      let match = await bcrypt.compare(user.password, users[0].password);
      expect(match).to.be.true;

      try {
        await personsServices.changePassword('newPassword', 'wrongOldPassword', user.id);
      } catch (err) {
        err.message.should.be.equal('The received oldPassword is not correct!');
      }

      // on check son password
      match = await bcrypt.compare('newPassword', user.password);
      expect(match).to.be.false;
    });

    it('should not change the password of a person because invalid personId (too short)', async() => {
      try {
        await personsServices.changePassword('newPassword', '1234abcd', 'abcdef');
      } catch (err) {
        err.message.should.to.be.equal('Received personId can\'t be found in the database!');
      }
    });

    it('should not change the password of a person because invalid personId (too long)', async() => {
      try {
        await personsServices.changePassword('newPassword', '1234abcd', 'abcdefabcdefabcdefabcdefabcdef');
      } catch (err) {
        err.message.should.be.equal('Received personId can\'t be found in the database!');
      }
    });

    it('should not change the password of a person because unknown personId', async() => {
      try {
        await personsServices.changePassword('newPassword', '1234abcd', 'abcdefabcdefabcdefabcdef');
      } catch (err) {
        err.message.should.be.equal('Received personId can\'t be found in the database!');
      }
    });
  });
});
