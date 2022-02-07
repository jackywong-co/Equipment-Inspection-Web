


import axiosInstance from '../services/axios.instance';

axiosInstance
    .get('user/')
    .then((response) => {
        console.log(response);
        const users = response.data.map((userData) => {
            return {
                id: userData.id,
                name: userData.username,
                role: (userData.is_staff) ? ("Manager") : ("Checker")
            };
        });
        // const USERLIST = response.data.map((userData) => {

        // })


    })

export const userData = () => {
    axiosInstance
    .get('user/')
    .then((response) => {
        console.log(response);
        const userData = response.data.map((userData => {
            return {
                id: userData.id,
                name: userData.username,
                role: (userData.is_staff) ? ("Manager") : ("Checker")
            };
        }));
        


    })
}

export default userData;
