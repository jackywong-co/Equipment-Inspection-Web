// import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(1)].map((_, index) => ({
  id: '12',
  avatarUrl: '/static/user.png/',
  name: 'faker.name.findName()', 
  status: sample(['active', 'banned']), 
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer'
  ])
}));

export default users;
