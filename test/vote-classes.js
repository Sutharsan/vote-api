import { expect } from 'chai';
import { Vote, AverageVote, VoteCount } from '../src/vote-classes';

describe('The Vote class', () => {
  it('create a normal Vote object', () => {
    const sut = new Vote(5, 3, 'source');

    expect(sut.id).to.eql(5);
    expect(sut.value).to.eql(3);
    expect(sut.source).to.eql('source');
  });

  it('create an empty Vote object', () => {
    const sut = new Vote();

    expect(sut.id).to.eql(undefined);
    expect(sut.value).to.eql(0);
    expect(sut.source).to.eql(undefined);
    expect(sut.timestamp).is.not.empty;
  });

  it('create a Vote object with non-text vote value', () => {
    const sut = new Vote('ab', 'cd', 'ef');

    expect(sut.id).to.eql('ab');
    expect(sut.value).to.eql(0);
    expect(sut.source).to.eql('ef');
  });
});

describe('The AverageVote class', () => {
  it('create a normal AverageVote object', () => {
    const data = {
      sum: 44,
      average: 3.3,
      count: 22,
    };
    const sut = new AverageVote(data);

    expect(sut.sum).to.eql(44);
    expect(sut.average).to.eql(3.3);
    expect(sut.count).to.eql(22);
  });

  it('create an empty AverageVote object', () => {
    const sut = new AverageVote();

    expect(sut.sum).to.eql(0);
    expect(sut.average).to.eql(0);
    expect(sut.count).to.eql(0);
  });

  it('add a vote to the AverageVote object', () => {
    const sut = new AverageVote();
    const voteOne = new Vote(1, 1, 'source');
    const voteTwo = new Vote(1, 2, 'source');
    const voteFour = new Vote(1, 4, 'source');

    sut.add(voteTwo);
    expect(sut.sum).to.eql(2);
    expect(sut.average).to.eql(2);
    expect(sut.count).to.eql(1);

    sut.add(voteFour);
    expect(sut.sum).to.eql(6);
    expect(sut.average).to.eql(3);
    expect(sut.count).to.eql(2);

    sut.add(voteOne);
    expect(sut.sum).to.eql(7);
    expect(sut.average).to.eql(2.3);
    expect(sut.count).to.eql(3);
  });
});

describe('The VoteCount class', () => {
  it('create a normal VoteCount object', () => {
    const data = {
      val_1: 5,
      val_2: 4,
      val_3: 3,
      val_4: 2,
      val_5: 1,
    };
    const sut = new VoteCount(data);

    expect(sut.val_1).to.eql(5);
    expect(sut.val_2).to.eql(4);
    expect(sut.val_3).to.eql(3);
    expect(sut.val_4).to.eql(2);
    expect(sut.val_5).to.eql(1);
  });

  it('create an empty VoteCount object', () => {
    const sut = new VoteCount();

    expect(sut.val_1).to.eql(0);
    expect(sut.val_2).to.eql(0);
    expect(sut.val_3).to.eql(0);
    expect(sut.val_4).to.eql(0);
    expect(sut.val_5).to.eql(0);
  });

  it('increase the VoteCount value', () => {
    const sut = new VoteCount();

    sut.increase(1);
    expect(sut.val_1).to.eql(1);
    expect(sut.val_2).to.eql(0);
    expect(sut.val_3).to.eql(0);
    expect(sut.val_4).to.eql(0);
    expect(sut.val_5).to.eql(0);

    sut.increase(3);
    expect(sut.val_1).to.eql(1);
    expect(sut.val_2).to.eql(0);
    expect(sut.val_3).to.eql(1);
    expect(sut.val_4).to.eql(0);
    expect(sut.val_5).to.eql(0);

    sut.increase(5);
    sut.increase(5);
    sut.increase(5);
    expect(sut.val_1).to.eql(1);
    expect(sut.val_2).to.eql(0);
    expect(sut.val_3).to.eql(1);
    expect(sut.val_4).to.eql(0);
    expect(sut.val_5).to.eql(3);
  });
});
