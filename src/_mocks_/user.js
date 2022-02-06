// import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------
import axiosInstance from '../services/axios.instance';
axiosInstance
  .get('user/')
  .then((response) => {
    console.log(response);
    const USERLIST = response.data.map((userData) => {
      return {
        id: userData.id,
        name: userData.username,
        role: (userData.is_staff) ? ("Manager") : ("Checker")
      };
    })


  })


const users = [...Array(5)].map((_, index) => ({
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
