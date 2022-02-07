// import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------
import axiosInstance from '../services/axios.instance';
import React, { useState, useEffect, useCallback } from 'react';
// const [user, setUsers] = useState([]);
const userslist = []
axiosInstance
  .get('user/')
  .then((response) => {
    console.log(response);
    userslist = response.data.map((userData) => {
      return {
        id: userData.id,
        name: userData.username,
        role: (userData.is_staff) ? ("Manager") : ("Checker")
      };
    })
    

  })

  console.log('userslist : ' + userslist)

const users = [].map((userslist) => ({
  id: userslist.id,
  avatarUrl: '/static/user.png/',
  name: userslist.username,
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
