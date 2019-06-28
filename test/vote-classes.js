import { expect } from 'chai';
import { Vote } from '../src/vote-classes';

describe('The Vote class', () => {
  it('creates a vote object', () => {
    const sut = new Vote(5, 5, 'source');

    expect(sut.source).to.eql('source');
  });
});
