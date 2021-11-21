<template>
  <div class='outer-container'>
      <div class='comments'>
      <!-- Comments of the blockage goes here
      Displayed in list form scrollable
      Click anywhere around popup to close it
      if user logged in, have textbox at bottom to add comment -->
      <div class='single-comment'>

            <div class='profile'>{{reporterUsername[0].toUpperCase()}}</div>
            <p class='username'><b>@{{reporterUsername}}</b> This blockage was freaking terrible I hate it. Lost my job over it.</p>
            <p class='time'>1d</p>
      </div>
       <div class='single-comment'>

            <div class='profile'>{{reporterUsername[0].toUpperCase()}}</div>
            <p class='username'><b>@{{reporterUsername}}</b> Jobless now anyone wanna hire me?</p>
            <p class='time'>2h</p>
      </div>
      </div>
      <div v-if='loggedIn' class='comment'>
      <textarea v-model='comment' placeholder="Say something about this blockage"></textarea>
      <button class='comment-button' :disabled='comment.length === 0' v-on:click='submitComment'>Post</button>
      </div>
  </div>
</template>

<script>

export default {
    name: 'Comments',
    props : {
        blockageData: Object,
        user: Object,
        loggedIn: Boolean,
    },
    emits: [
    ],
    data () {
        return {
            comment: '',
            reporterUsername: 'dumpling'
        };
    },
    methods: {
        submitComment () {
            // axios request to submit comment in this.comment
            // if successful, set this.comment = ''
        }
    }
}
</script>

<style scoped>

.time {
    margin-left: 10px;
}
.single-comment {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
.profile {
    background-color: rgb(90, 0, 128);
    border-radius: 30px;
    color: rgb(254, 254, 254);
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    /* margin-right: 10px; */
    /* font-weight: bold; */
}

.username {
    margin: 0px;
    margin-left: 10px;
    width: 80%;
    color: black;
    text-align: left;
}

.outer-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgb(208, 181, 252);
    padding: 20px;
    color: purple;
    border-radius: 10px;
    width: 50%;
    height: 80%;
    /* background: rgba(63, 58, 58, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%; */
    z-index: 6;
}

textarea {
    padding: 5px 10px;
    text-decoration: none;
    height: 20px;
    border: none;
    border-radius: 20px;
    display: flex;
    align-items: center;
    width: 80%;
}

.comment {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.comment-button {
    background-color: rgb(89, 18, 125);
    color: white;
    margin-left: 10px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: bold;
    padding: 4px 10px;
    border: none;
}
button:hover {
    background-color: rgb(255, 255, 163);
    color: rgb(81, 43, 169)
}

.comment-button:disabled {
    color: white;
    background-color: rgb(131, 131, 131);
}
</style>