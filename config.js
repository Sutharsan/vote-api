import dotenv from 'dotenv';

dotenv.config();

const config = {
  appSeverPort: 3000,
  voteStorageDirectory: './storage',
  floodWindow: 3600,
  floodThresholdById: 1,
  floodThresholdBySource: 10,
};

export default config;
