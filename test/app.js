import mock from 'mock-fs';
import config from '../src/config';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

describe('The Vote class', () => {
  const storageDirectory = config.voteStorageDirectory;

  // TODO Mock the file system.
  // beforeEach(() => {
  //   mock({
  //     storageDirectory: {
  //       'history': {},
  //       'count': {},
  //       'average': {},
  //     }
  //   });
  // });
  //
  // afterEach(() => {
  //   mock.restore();
  // });

  describe('POST a vote', () => {
    it('should give vote data', (done) => {
      const id = '1';
      const vote = 1;
      const requester = chai.request(app).keepOpen();

      requester
        .post(`/vote/${id}/${vote}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.eql({ count: 1, average: 1 });
          done();
        });

      // TODO Terminate the server after tests.
    });
  });

});
