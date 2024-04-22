import { apiurl, apiurlKeycloack, realm, clientId, clientSecret } from '../../appProperties';

export class ApiService {

	

	async getLogin(formData) {
		const response = await fetch(apiurl + '/v1/login/', {
				method: 'POST',
				headers: { 
					Accept: 'application/json',
					Authorization: 'Bearer test111test' ,
					'Content-Type': 'application/json'
					 },
				body: JSON.stringify({
					username: formData.username,
					password: formData.password
				})
			});
		const status = response.status;
		const rem = await response.json();
		const res = { error: false, data: rem};
		if (status != 200) {
			res.error = true,
			res.data = rem.detail;
		} else {
			PnoJS.utils.setCookie('glk', 1);
			PnoJS.utils.setCookie('glk-u', formData.username);
			window.location.href = "/main";
		}

		return res;
	}

	async getMapData() {
		const response = await fetch(apiurl + '/v1/getusermap/' + PnoJS.utils.getCookie('glk-u'), {
				headers: { Authorization: 'Bearer test111test' }
			});
		const rem = await response.json();
		return rem;
	}

	async getAllDevices() {
		const response = await fetch(apiurl + '/v1/devices/all', {
				headers: { Authorization: 'Bearer test111test' }
			});
		const rem = await response.json();
		return rem.data;
	}

	async getAllUsers() {
		const response = await fetch(apiurl + '/v1/users/all?page_num=1&page_size=1000', {
				headers: { Authorization: 'Bearer test111test' }
			});
		const rem = await response.json();
		return rem.data;
	}

	async getAllGroups() {
		const response = await fetch(apiurl + '/v1/groups/all?page_num=1&page_size=1000', {
				headers: { Authorization: 'Bearer test111test' }
			});
		const rem = await response.json();
		return rem.data;
	}

	async editGroup(data) {
		let devices = data.devices.map((item) => { return item.col_id});
		const response = await fetch(apiurl + '/v1/group/', {
				method: 'PATCH',
				headers: { 
					Accept: 'application/json',
					Authorization: 'Bearer test111test' ,
					'Content-Type': 'application/json'
					 },
				body: JSON.stringify({
					groupid: data.id,
					description: data.group_description,
					devices: devices
				})
			});
		const status = response.status;
		const rem = await response.json();
		const res = { error: false, data: rem};
		if (status != 200) {
			res.error = true,
			res.data = rem.detail;
		}

		return res;
	}

	async saveUser(data) {
			
		const response = await fetch(apiurl + '/v1/user/', {
				method: 'POST',
				headers: { 
					Accept: 'application/json',
					Authorization: 'Bearer test111test' ,
					'Content-Type': 'application/json'
					 },
				body: JSON.stringify({
					username: data.username,
					fname: data.fname,
					lname: data.lname,
					phone_num: data.phone_num,
					password: data.password
				})
			});	
		const status = response.status;
		const rem = await response.json();
		const res = { error: false, data: rem};
		if (status != 200) {
			res.error = true,
			res.data = rem.detail;
		}

		return res;
	}

	async editUser(data) {
		let groups = data.groups.map((item) => { return item.id});
		const response = await fetch(apiurl + '/v1/user/', {
				method: 'PATCH',
				headers: { 
					Accept: 'application/json',
					Authorization: 'Bearer test111test' ,
					'Content-Type': 'application/json'
					 },
				body: JSON.stringify({
					username: data.username,
					fname: data.fname,
					lname: data.lname,
					phone_num: data.phone_num,
					password: data.password,
					groupsids: groups
				})
			});
		const status = response.status;
		const rem = await response.json();
		const res = { error: false, data: rem};
		if (status != 200) {
			res.error = true,
			res.data = rem.detail;
		}

		return res;
	}

	async deleteUser(username) {
		const response = await fetch(apiurl + '/v1/user/' + username, {
				method: 'DELETE',
				headers: { 
					Accept: 'application/json',
					Authorization: 'Bearer test111test' 
					 }
			});
		const status = response.status;
		const rem = await response.json();
		const res = { error: false, data: rem};
		if (status != 200) {
			res.error = true,
			res.data = rem.detail;
		}

		return res;
	}

	async loginToKeycloak(username, password) {
        const url = `${apiurlKeycloack}realms/${realm}/protocol/openid-connect/token`;

        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('grant_type', 'password');
		// const response = await fetch(url, {
		// 	method: 'POST',
		// 	headers: { 
        //         'Content-Type': 'application/x-www-form-urlencoded'
		// 		 },
		// 		 body: formData

		// });
		// console.log('TESTTTTTTTTTTTT');
		// console.log (response);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Σφάλμα κατά την είσοδο στο Keycloak');
            }
            return response.json();
        })
        .then(data => {
            data.responseEnum = 'OPERATION_SUCCESS';
            console.log('Επιτυχής σύνδεση στο Keycloak:', data);
            return data;
        })
        .catch(error => {
            let data = {};
            data.responseEnum = 'AUTH_ERROR';
            console.error('Σφάλμα κατά την σύνδεση στο Keycloak:', error.message);
            return data;
        });
    }

	async  logoutFromKeycloak() {
		const url = `${apiurlKeycloack}realms/${realm}/protocol/openid-connect/logout`;
		const clientId = clientId;
		const clientSecret = clientSecret;
		const refreshToken = localStorage.getItem('jwtRefreshToken');
		const formData = new URLSearchParams();
		formData.append('client_id', clientId);
		formData.append('client_secret', clientSecret);
		formData.append('refresh_token', refreshToken);
	
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData
			});
	
			if (!response.ok) {
				throw new Error('Error during logout');
			}
	
			console.log('logout completted');
		} catch (error) {
			console.error('Error during logout:', error.message);
			throw error;
		}
	}


}
