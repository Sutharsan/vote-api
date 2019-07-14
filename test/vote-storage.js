import mock from 'mock-fs';
import { expect } from 'chai';
import { initStorage, addVote, getVoteAverage, getVoteCount } from '../src/vote-storage';

describe('The Vote class', () => {
  const storageDirectory = 'test-storage';

  beforeEach(() => {
    mock({
      storageDirectory: {
        'history': {},
        'count': {},
        'average': {},
      }
    });

    (async () => {
      await initStorage(storageDirectory);
    })();
  });

  afterEach(() => {
    mock.restore();
  });

  it('single addVote call', () => {
    const id = '1';
    const source = 'source';
    addVote(id, 1, source)
      .then(() => getVoteCount(id))
      .then(voteCount => {
        expect(voteCount.val_1).to.eql(1);
        expect(voteCount.val_2).to.eql(0);
        expect(voteCount.val_3).to.eql(0);
        expect(voteCount.val_4).to.eql(0);
        expect(voteCount.val_5).to.eql(0);
      })
      .then(() => getVoteAverage(id))
      .then(averageVote => {
        expect(averageVote.sum).to.eql(1);
        expect(averageVote.average).to.eql(1);
        expect(averageVote.count).to.eql(1);
      });
  });

  it('multiple addVote calls', () => {
    const id = '1';
    const source = 'source';
    addVote(id, 1, source)
      .then(() => addVote(id, 3, source))
      .then(() => addVote(id, 3, source))
      .then(() => getVoteCount(id))
      .then(voteCount => {
        expect(voteCount.val_1).to.eql(1);
        expect(voteCount.val_2).to.eql(0);
        expect(voteCount.val_3).to.eql(2);
        expect(voteCount.val_4).to.eql(0);
        expect(voteCount.val_5).to.eql(0);
      })
      .then(() => getVoteAverage(id))
      .then(averageVote => {
        expect(averageVote.sum).to.eql(7);
        expect(averageVote.average).to.eql(2.3);
        expect(averageVote.count).to.eql(3);
      });
  });

});
