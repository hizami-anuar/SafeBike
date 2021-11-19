<template>
  <section class='sign-up-form' v-on:submit.prevent='signup'>
    <h2 class='message'>Sign Up</h2>
    <form action="">
      <strong class='error' v-if='this.signupError.length > 0'>{{this.signupError}}</strong> 

      <!-- The Username and its label -->
      <label for="fusername">Username</label> <br/>
      <input v-model='username' type="text" class="textbox" id="fusername" name="fusername">

      <!-- The first Password field -->
      <label for="fpassword textbox">Password</label> <br/>
      <input v-model='password' type="password" class="textbox" id="fpassword" name="fpassword"> 

      <!-- The second Password field -->
      <label for="fpassword-confirm textbox">Confirm Password</label> <br/>
      <input v-model='passwordConfirm' type="password" class="textbox" id="fpassword-confirm" name="fpassword-confirm"> 

      <!-- The Create Account Button -->
      <button v-on:click.prevent="signup" :disabled="username.length === 0 || password.length === 0 || passwordConfirm.length === 0">Create Account</button>
    </form>
    <!-- The link for toggling between signing in and signing up -->
    <span class='message'>
      Already have an account? 
      <router-link to="/login">Log in here!</router-link>
    </span>
  </section>
</template>

<script>
import { eventBus } from "../main";
import axios from 'axios';

export default {
  name: 'Signup',
  data() {
    return {
      username: "",
      password: "",
      passwordConfirm: "",
      signupError: ""
    };
  },
  methods: {
    /**
     * Validates that the proposed username and password fields fit some criteria. 
     * The criteria include that the fields cannot be empty and that both passwords
     * must match. 
     * 
     * @param {string} username - The text the user wants to enter as their username
     * @param {string} password - The text the user wants as their password
     * @param {string} passwordConfirm - The text in the second password field for confirmation
     * @returns {boolean} True if the proposed fields all fit some criteria.
     */
    validate(username, password, passwordConfirm) {
      // Make sure that the password fields match
      if (password != passwordConfirm) {
        this.signupError = 'Passwords do not match.';
        return false;
      }
      // Make sure neither password and username are empty
      if (password.length == 0) {
        this.signupError = 'Cannot have an empty password.';
        return false;
      }
      if (username.length == 0) {
        this.signupError = 'Cannot have an empty username.';
        return false;
      }
      return true;
    },

    /**
     * Makes a call to the API endpoint to create an account. If creating the account
     * was successful, the user is automatically logged in. 
     */
    signup() {
      let fields = {
        username: this.username,
        password: this.password,
      }

        // Validate the field inputs before proceeding. If invalid, gives an error message
        if (!this.validate(this.username, this.password, this.passwordConfirm)) return;
      axios.post('/api/users', fields)
        .then((response) => {
          eventBus.$emit('login-event', response);
          this.signupError = '';
          this.$router.push({ name: "Home"});
        }).catch((error) => {
          this.signupError = error.response.data.error
                              || error.response.data.message
                              || "An unknown error occurred when signing up.";
      })
    },
  }
}
</script>

<style scoped>

.sign-up-form {
    padding-left: 50%;
    width: 50%;
    display: flex;
    align-items: center;
    height: 500px;
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
    /* margin-top: -20px; */
}

.message {
    width: 500px;
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

.textbox {
    border: none;
    padding: 5px 15px;
    border-radius: 5px;
    margin-top: -20px;
    font-size: 20px;
    margin-bottom: 25px;
}

h2{
    color: rgb(79, 0, 128);
    font-size: 48px;
    margin-bottom: 0px;
}
.toggle-option{
    font-weight: bold;
}
.toggle-option:hover{
    cursor: pointer;
    text-decoration: underline;
}
.error{
  color: red;
}
</style>