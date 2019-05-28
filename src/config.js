import dotenv from 'dotenv';

dotenv.config();

const config = {
  appSeverPort: process.env.VOTE_PORT || 3000,
  voteStorageDirectory: process.env.VOTE_STORAGE || './storage',
  floodWindow: process.env.VOTE_FLOOD_WINDOW || 3600,
  floodThresholdById: process.env.VOTE_FLOOD_BY_ID || 1,
  floodThresholdBySource: process.env.VOTE_FLOOD_BY_SOURCE || 10,
};

export default config;
