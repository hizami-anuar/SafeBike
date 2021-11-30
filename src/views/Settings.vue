<template>
  <main class='manage-profile'>
    <h2>Welcome back, 
      <router-link v-if='loggedIn' :to="{name: 'User', params: {username: this.user.username}}">@{{ this.user.username }}</router-link>!
    </h2>
    
    <hr>

    <!-- Prompt for Changing the Password -->
    <fieldset>
      <legend>Change Password</legend>

      <!-- Error and Success Messages, which are hidden by default -->
      <label for="password" class='error' v-if='this.passwordError'>
        <strong>{{this.passwordError}}</strong>
      </label>
      <label for="password" class='success' v-if='this.passwordSuccess'>
        <strong>{{this.passwordSuccess}}</strong>
      </label>

      <form v-on:submit.prevent='changePassword'>
        <div>
          <label for="password">New Password:</label> <br>
          <input type='password' v-model='password1' id="password" name="password" />
        </div>
        <div>
          <label for="password2">Confirm New Password:</label> <br>
          <input type='password' v-model='password2' id="password2" name="password2" />
        </div>
        <button 
          type='submit' 
          class='submit-button'
          :disabled="password1.length===0 || password2.length === 0" 
          >Update Password</button>
      </form>
    </fieldset>

    <!-- Prompt for Changing the Username -->
    <fieldset>
      <legend>Change Username</legend>
      <!-- Error and Success Messages, which are hidden by default -->
      <label for="username" class='error' v-if='this.usernameError'>
        <strong>{{this.usernameError}}</strong>
      </label>
      <label for="username" class='success' v-if='this.usernameSuccess'>
        <strong>{{this.usernameSuccess}}</strong>
      </label>
      <!-- The Fields for Changing the Username -->
      <form v-on:submit.prevent='changeUsername'>
        <div>
          <label for="username">New Username:</label> <br>
          <input id="username" v-model='newUsername'/>
        </div>
        <button 
          type='submit' 
          class='submit-button' 
          :disabled="newUsername.length === 0" 
          >Update Username</button>
      </form>
    </fieldset>

    <!-- Delete Account -->
    <fieldset>
      <legend>Delete Account</legend>
      <p>
        <b><u>Warning:</u></b> Deleting your account will remove your username from your blockage reports, but will not delete them. You will also lose the ability to modify any of your blockage reports. This is permanent and cannot be undone.
      </p>
      <button class='delete-account-button' v-on:click.prevent='deleteAccount'>Delete Account</button>
    </fieldset>
    <br>
  </main>
</template>

<script>
import { eventBus } from "@/main";
import axios from "axios";

/**
 * @param {string} password
 * @param {string} passwordConfirm
 * @returns {boolean} True if the passwords are both
 */
const validatePasswords = (password, passwordConfirm) => {
  // 1. Both must match
  if (password != passwordConfirm) return false;
  // 2. Passwords must be non-empty
  if (password.length == 0) return false;
  return true;
};

export default {
  name: "Settings",
  props: {
    loggedIn: Boolean,
    user: Object,
  },
  data() {
    return {
      passwordError: '',
      passwordSuccess: '',
      password1: '',
      password2: '',
      usernameError: '',
      usernameSuccess: '',
      deleteAccountError: '',
      logoutError: '', 
      newUsername: '',
    };
  },
  methods: {

    /**
     * Sends an API request to delete the current user. If the API request is successful, 
     * sends to the root that the User is no longer logged in. 
     */
    deleteAccount() {
      // If they change their mind (aka not confirm) do nothing
      if (!confirm("Deleting your account is permanent and cannot be undone. Are you sure you want to delete your account?"))
        return;
      // They confirmed, so we continue
      axios
        .delete('/api/users/')
        .then((response) => {
          this.deleteAccountError = '';
          eventBus.$emit('logout-event', response);
          this.$router.push({ name: "Home"});
        })
        .catch((err) => {
          console.log(err);
          this.deleteAccountError = err.response.data.error 
                                    || err.response.data.message 
                                    || "An unknown error occurred when deleting your account";
        });
    },

    /**
     * Sends a request to change the password if the form is filled with valid
     *
     * @param {SubmitEvent} a - Event Data for submitting the Change Password form
     */
    changePassword() {
      // Get the Form Data
      const data = {
        'password': this.password1,
        'password2': this.password2
      };

      // Validate that both password fields are equal before proceeding
      if (!validatePasswords(data["password"], data["password2"])) {
        this.passwordSuccess = '';
        this.passwordError = 'Passwords are not matching';
        return;
      }

      axios
        .put(`api/users/password`, { password: data["password"] })
        .then(() => {
          this.clearMessages();
          this.passwordSuccess = 'Successfully updated password';
          this.password1 = '';
          this.password2 = '';
        })
        .catch((err) => {
          console.log(err.response || err);
          this.clearMessages();
          this.passwordError = err.response.data.error 
                               || err.response.data.message 
                               || "An unknown error occurred when changing your password.";
        });
    },

    /**
     * @param {SubmitEvent} a - Event Data for submitting the Change Username form
     */
    changeUsername() {
      // Prevent webpage reload
      axios
        .put(`/api/users/username`, {username: this.newUsername})
        .then((response) => {
          // Propogates up to the root that the username has changed
          eventBus.$emit('login-event', response);
          this.clearMessages();
          this.usernameSuccess = 'Successfully changed username to: ' + this.newUsername;
          this.newUsername = '';
        })
        .catch((err) => {
          this.clearMessages();
          this.usernameError = err.response.data.error 
                               || err.response.data.message 
                               || "An unknown error occurred when changing your username.";
        });
    },

    /** clears all error/success messages */
    clearMessages() {
      this.usernameError = '';
      this.usernameSuccess = '';
      this.passwordError = '';
      this.passwordSuccess = '';
    }
  },
};
</script>

<style scoped>

button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  border: none;
}

button:hover:enabled {
    background-color: rgb(250, 250, 171);
    color: rgb(81, 22, 121);
}


fieldset {
  font-size: 18px;
  line-height: 2em;
  border-radius: 0.5em;
  margin: 1em 0 1em 0;
}

fieldset input {
  border-color: gray;
  border-radius: 3px;
  height: 24px;
  width: 50%;
  padding: 0px 10px;
  border: none;
  background-color: rgb(253, 249, 255);
  border: 1px rgb(119, 62, 156) solid;
}

fieldset .submit-button {
  background: none;
  background-color: rgb(81, 22, 121);
  color: white;
  padding: 10px 18px;
  border-color: gray;
  border-radius: 10px;
  font-size: 18px;
  margin-top: 1em;
}

button:disabled {
    background-color: rgb(148, 148, 148);
    color: rgb(235, 235, 235);
    cursor: not-allowed;
}


legend {
  font-size: 1.25em;
  font-weight: bold;
}

.error{
  color: red;
}
.success{
  color: rgb(81, 22, 121);
}
.delete-account-button{
  background: hsl(0, 100%, 60%);
  color: white;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  padding: 0.5em;
  margin-top: 1em;
  border: none;
}
.delete-account-button:hover {
  background-color: rgb(81, 22, 121);
  color: white;
  cursor: pointer;
}
.manage-profile{
  text-align: left;
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
  margin-top: 75px;
}

h2 {
  font-size: 28px;
}
</style>