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
		console.log('clientId');

		console.log(clientId);
		console.log(clientSecret);
		console.log(password);
		console.log(username);

        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('grant_type', 'password');

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
		const clientId1 = clientId;
		const clientSecret1 = clientSecret;
		const refreshToken1 = localStorage.getItem('jwtRefreshToken');
		const formData = new URLSearchParams();
		formData.append('client_id', clientId1);
		formData.append('client_secret', clientSecret1);
		formData.append('refresh_token', refreshToken1);
	
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

	async  resetPassword(userId, newPassword) {
		const resetUrl = `${apiurlKeycloack}admin/realms/myrealm/users/${userId}/reset-password`;
	
		const accessToken = localStorage.getItem('jwtToken');
	
		const requestBody = {
			type: 'password',
			value: newPassword,
			temporary: false
		};
	
		try {
			const response = await fetch(resetUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				},
				body: JSON.stringify(requestBody)
			});
	
			if (!response.ok) {
				throw new Error('Failed to reset password');
			}
	
			console.log(response);
			//const responseData = await response.json();
			//console.log('Password reset successful:', responseData);
	
			return 'completted';
		} catch (error) {
			console.error('Error resetting password:', error.message);
			throw error; 
		}
	}


	async  getUserInfo() {
		const url = `${apiurlKeycloack}realms/${realm}/protocol/openid-connect/userinfo?scope=openid`;
		const accessToken = localStorage.getItem('jwtToken');
	
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${accessToken}`
				}
			});
	
			if (!response.ok) {
				throw new Error('Failed to fetch user info');
			}
	
			const userInfo = await response.json();
			console.log('User Info:', userInfo);
			return userInfo;
		
	}
	

	async  changePasswordInKeycloak(oldPassword, newPassword) {
		const url = `${apiurlKeycloack}realms/${realm}/account/credentials/password`;
		const accessToken = localStorage.getItem('jwtToken');
	
		const data = {
			currentPassword: oldPassword,
			newPassword: newPassword,
			confirmation: newPassword
		};
	
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
	
			if (!response.ok) {
				throw new Error('Error changing password');
			}
	
			console.log('Password changed successfully');
		} catch (error) {
			console.error('Error changing password:', error.message);
			throw error;
		}
	}
	async getAccessToken() {
        const url = `${apiurlKeycloack}realms/${realm}/protocol/openid-connect/token`;
        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('grant_type', 'client_credentials');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to obtain access token');
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error obtaining access token:', error.message);
            throw error;
        }
    }

	async createUserInKeycloak(userData) {
        const url = `${apiurlKeycloack}admin/realms/${realm}/users`;
        const accessToken = await this.getAccessToken();

        const user = {
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            enabled: true,
			emailVerified: true,
            credentials: [{
                type: 'password',
                value: userData.password,
                temporary: false
            }]
        };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(user)
            });

           if (response.status === 201) {
			return "SUCCESS"
		   }



            const createdUser = await response.json();
			if (response.status === 409) {
				return "ALREADY_REGISTER";
			}

            return "SERVER_ERROR";
        
    }


	async findUserByEmail(email, accessToken) {
		const url = `${apiurlKeycloack}admin/realms/${realm}/users?email=${encodeURIComponent(email)}`;
	  
		try {
		  const response = await fetch(url, {
			method: 'GET',
			headers: {
			  'Authorization': `Bearer ${accessToken}`,
			  'Content-Type': 'application/json'
			}
		  });
	  
		  if (!response.ok) {
			throw new Error('Failed to find user');
		  }
	  
		  const users = await response.json();
		  if (users.length > 0) {
			return users[0].id; // Επιστρέφει το ID του πρώτου χρήστη που βρέθηκε
		  }
		  return null; // Αν δεν βρέθηκε χρήστης
		} catch (error) {
		  console.error('Error finding user:', error);
		  throw error;
		}
	  }
	  
	  async sendResetPasswordEmail(userId, accessToken) {
		const url = `${apiurlKeycloack}admin/realms/${realm}/users/${userId}/execute-actions-email?client_id=${clientId}`;
	  
		try {
		  const response = await fetch(url, {
			method: 'PUT',
			headers: {
			  'Authorization': `Bearer ${accessToken}`,
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(['UPDATE_PASSWORD'])
		  });
	  
		  if (!response.ok) {
			throw new Error('Failed to send reset password email');
		  }
	  
		  return true;
		} catch (error) {
		  console.error('Error sending reset password email:', error);
		  throw error;
		}
	  }


	async findUserByEmail(email, accessToken) {
		const url = `${apiurlKeycloack}admin/realms/${realm}/users?email=${encodeURIComponent(email)}`;
	  
		try {
		  const response = await fetch(url, {
			method: 'GET',
			headers: {
			  'Authorization': `Bearer ${accessToken}`,
			  'Content-Type': 'application/json'
			}
		  });
	  
		  if (!response.ok) {
			throw new Error('Failed to find user');
		  }
	  
		  const users = await response.json();
		  if (users.length > 0) {
			return users[0].id; // Επιστρέφει το ID του πρώτου χρήστη που βρέθηκε
		  }
		  return null; // Αν δεν βρέθηκε χρήστης
		} catch (error) {
		  console.error('Error finding user:', error);
		  throw error;
		}
	  }
	  
	  async sendResetPasswordEmail(userId, accessToken) {
		const url = `${apiurlKeycloack}admin/realms/${realm}/users/${userId}/execute-actions-email?client_id=${clientId}`;
	  
		try {
		  const response = await fetch(url, {
			method: 'PUT',
			headers: {
			  'Authorization': `Bearer ${accessToken}`,
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(['UPDATE_PASSWORD'])
		  });
	  
		  if (!response.ok) {
			throw new Error('Failed to send reset password email');
		  }
	  
		  return true;
		} catch (error) {
		  console.error('Error sending reset password email:', error);
		  throw error;
		}
	  }

	  async  introspectToken(token) {
		const introspectionEndpoint = `${apiurlKeycloack}realms/${realm}/protocol/openid-connect/token/introspect`;
		
		const formData = new URLSearchParams();
		formData.append('token', token);
		formData.append('client_id', clientId);
		formData.append('client_secret', clientSecret);

	
		try {
			const response = await fetch(introspectionEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					

				},
				body: formData,

			});
			console.log(response)
	
			if (!response.ok) {
			}
	
			const data = await response.json();
	
			// Το 'active' field δείχνει αν το token είναι έγκυρο
			if (data.active === true) {
				console.log('Token is valid');
				return true;
			} else {
				console.log('Token is not valid');
				return false;
			}
		} catch (error) {
			console.error('Error during token introspection:', error);
			return false;
		}
	}

}
