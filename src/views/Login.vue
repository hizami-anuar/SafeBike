<template>
	<section class='sign-up-form'>
		<h2>Login</h2>
		<form action="">
			<strong class='error' v-if='this.loginError.length > 0'>{{this.loginError}}</strong> <br/>
			<!-- The Username and its label -->
			<label for="fusername">Username</label> <br/>
			<input v-model='username' type="text" id="fusername" name="fusername"> <br/><br/>
			<!-- The first Password field -->
			<label for="fpassword">Password</label> <br/>
			<input v-model='password' type="password" id="fpassword" name="fpassword"> <br/><br/>
			<!-- The Create Account Button -->
			<button v-on:click.prevent="login" :disabled="username.length === 0 || password.length === 0">Log In</button>
		</form>
		<!-- The link for toggling between signing in and signing up -->
		<span class='message'>
			Don't have an account? 
			<router-link to="/signup">Sign up here!</router-link>
		</span>
	</section>
</template>

<script>
import { eventBus } from "../main";
import axios from 'axios';

export default {
	name: 'Login',
	props: {}, 
	data() {
		return {
			username: '',
			password: '',
			loginError: ''
		};
	},
	methods: {
		/**
		 * Sends a request to the API server with the given username and password. If the
		 * log-in was successful, a message is emitted to the parent Profile component
		 * with the username of the user. 
		 */
		login() { 
			const fields = { 
				username : this.username, 
				password : this.password
			};
			axios.post('/api/session', fields)
				.then((response) => {
					eventBus.$emit('login-event', response);
					this.$router.push({ name: "Home"});
					this.loggedIn = true;
					this.user = response.data;
				}).catch((error) => {
					this.loginError = error.response.data.error 
															|| error.response.data.message
															|| "An unknown error occurred when logging in.";
				})
		}
	}
}
</script>

<style scoped>

.sign-up-form {
    margin-top: 70px;
    padding-left: 50%;
    width: 50%;
    height: 90%;
    display: flex;
    align-items: center;
}
button {
    padding: 15px 25px;
    font-size: 20px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold; 
    border-radius: 30px;
    background-color: rgb(98, 55, 227);
    color: white;
    border: none;
    /* margin-top: -10px; */
}


button:disabled {
    background-color: rgb(148, 148, 148);
    color: rgb(235, 235, 235);
}
button:hover:enabled {
    background-color: rgb(254, 247, 158);
    color: rgb(90, 7, 131);
    cursor: pointer;
}

#fusername {
    border: none;
    padding: 5px 15px;
    border-radius: 5px;
    margin-top: 2px;
    font-size: 20px;
    margin-top: -15px;
    border: 2px rgb(111, 14, 171) solid;

}
#fpassword {
    border: none;
    padding: 5px 15px;
    border-radius: 5px;
    margin-top: 2px;
    font-size: 20px;
    margin-top: -15px;
    border: 2px rgb(111, 14, 171) solid;
}

textarea {
    margin-top: -10px;
}
h2{
    color: rgb(79, 0, 128);
    font-size: 48px;
    margin-bottom: -5px;
}
.toggle-option{
    font-weight: bold;
}
.toggle-option:hover{
    cursor: pointer;
    text-decoration: underline;
}
.message {
    width: 500px;
}
.error{
    color: red;
}
</style>