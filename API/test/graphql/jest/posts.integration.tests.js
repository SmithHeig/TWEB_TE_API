const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { resolvers, schema: typeDefs } = require('../../../src/graphql/graphqlConfig');
const clearDB = require('../clearDB');
const { populateDB, getTabUsers, getTabPosts } = require('../../populateDatabase');

// Making schema graphql
const schema = makeExecutableSchema({ typeDefs, resolvers });

let tabUsers;
let tabPosts;

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();

  // ------------------------------------------- on ajoute le contenu de départ -------------------------------------------
  await populateDB();

  tabUsers = getTabUsers();
  tabPosts = getTabPosts();
};

describe('Testing graphql resquest posts', () => {
  beforeEach(async() => clearAndPopulateDB());

  describe('QUERY tokens', () => {
    // ----------------------postsOfUser(userId: ID!)-------------------------------------- //
    describe('Testing postsOfUser(userId: ID!)', () => {
      const { query } = {
        query: `query ($userId: ID!){
                  postsOfUser(userId: $userId){
                    id
                    user{
                      id
                      firstname
                      lastname
                      email
                    }
                    text
                    publicationDate
                  }
                }`
      };

      it('should return all the posts of the user', async(done) => {
        const variables = { userId: tabUsers[0].id };
        const result = await graphql(schema, query, null, {}, variables);
        expect(result.data.postsOfUser.length).toEqual(2);
        done();
      });


      it('should return an empty tab of post of the user because unknown userId received', async(done) => {
        const variables = { userId: 'abcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(2);
        expect(result.data.postsOfUser.length).toEqual(0);
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting al posts of the user because invalid id received (too short)', async(done) => {
        const variables = { userId: 'abcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(`Cast to ObjectId failed for value "${variables.userId}" at path "userId" for model "posts"`);
        expect(result.data).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail getting al posts of the user because invalid id received (too long)', async(done) => {
        const variables = { userId: 'abcdefabcdefabcdefabcdefabcdef' };
        const result = await graphql(schema, query, null, {}, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(`Cast to ObjectId failed for value "${variables.userId}" at path "userId" for model "posts"`);
        expect(result.data).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });

  describe('MUTATION tokens', () => {
    // ----------------------addPostOfUser(post: PostInputAdd!)-------------------------------------- //
    describe('Testing addPostOfUser(post: PostInputAdd!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email };
      });

      const { mutation } = {
        mutation: `mutation($post: PostInputAdd!){
                     addPostOfUser(post: $post){
                       id
                       user{
                         id
                         firstname
                         lastname
                         email
                       }
                       text
                       publicationDate
                     }
                   }`
      };

      it('should add a new post', async(done) => {
        const variables = {
          post: {
            userId: tabUsers[0].id,
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect(result.data.addPostOfUser).not.toBeNull();
        done();
      });

      it('should fail adding a new post because unknown userId received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          post: {
            userId: context.id,
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new post because invalid userId received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = {
          post: {
            userId: context.id,
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message)
          .toEqual(expect.stringContaining(`posts validation failed: userId: Cast to ObjectID failed for value "${variables.post.userId}" at path "userId"`));
        expect(result.data).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new post because invalid userId received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          post: {
            userId: context.id,
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message)
          .toEqual(expect.stringContaining(`posts validation failed: userId: Cast to ObjectID failed for value "${variables.post.userId}" at path "userId"`));
        expect(result.data).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new post because missing mendatory information (userId)', async(done) => {
        const variables = {
          post: {
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.userId of required type ID! was not provided.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a new post because missing mendatory information (text)', async(done) => {
        const variables = {
          post: {
            userId: 'abcdefabcdefabcdefabcdefabcdef'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(3);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Field value.text of required type String! was not provided.'));
        expect(result).toMatchSnapshot();
        done();
      });


      it('should fail adding a post because not authenticated', async(done) => {
        const variables = {
          post: {
            userId: tabUsers[0].id,
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail adding a post because not authenticated as yourself', async(done) => {
        const variables = {
          post: {
            userId: tabUsers[1].id,
            text: 'Ceci est un nouveau post.'
          }
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });
    });


    // ----------------------deletePostOfUser(userId: ID!, postId: ID!)-------------------------------------- //
    describe('Testing deletePostOfUser(userId: ID!, postId: ID!)', () => {
      let context;
      beforeEach(async() => {
        await clearAndPopulateDB();
        context = { id: tabUsers[0].id, email: tabUsers[0].email };
      });

      const { mutation } = {
        mutation: `mutation($userId: ID!, $postId: ID!){
                     deletePostOfUser(userId: $userId, postId: $postId){
                       user{
                         firstname
                         lastname
                         email
                       }
                       text
                     }
                   }`
      };

      it('should delete a post', async(done) => {
        const variables = {
          userId: tabUsers[0].id,
          postId: tabPosts[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deletePostOfUser).not.toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not delete a post because not authenticated', async(done) => {
        const variables = {
          userId: tabUsers[0].id,
          postId: tabPosts[0].id
        };
        const result = await graphql(schema, mutation, null, {}, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('Sorry, you need to be authenticated to do that.'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should not delete a post because not authenticated as yourself', async(done) => {
        const variables = {
          userId: tabUsers[1].id,
          postId: tabPosts[2].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors).not.toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual(expect.stringContaining('You can\'t modify information of another user than yourself!'));
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a post because unknown userId received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          userId: context.id,
          postId: tabPosts[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deletePostOfUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a post because invalid userId received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = {
          userId: context.id,
          postId: tabPosts[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received userId is invalid!');
        expect(result.data.deletePostOfUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a post because invalid userId received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          userId: context.id,
          postId: tabPosts[0].id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('Received userId is invalid!');
        expect(result.data.deletePostOfUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a post because unknown postId received', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdef';
        const variables = {
          userId: tabUsers[0].id,
          postId: context.id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(2);
        expect(result.data.deletePostOfUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a post because invalid postId received (too short)', async(done) => {
        context.id = 'abcdef';
        const variables = {
          userId: tabUsers[0].id,
          postId: context.id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('You can\'t modify information of another user than yourself!');
        expect(result.data.deletePostOfUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });

      it('should fail deleting a post because invalid postId received (too long)', async(done) => {
        context.id = 'abcdefabcdefabcdefabcdefabcdef';
        const variables = {
          userId: tabUsers[0].id,
          postId: context.id
        };
        const result = await graphql(schema, mutation, null, context, variables);
        expect.assertions(4);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toEqual('You can\'t modify information of another user than yourself!');
        expect(result.data.deletePostOfUser).toBeNull();
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
