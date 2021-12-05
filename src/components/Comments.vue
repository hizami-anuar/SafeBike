<template>
  <div class='outer-container'>
    <div class='comments'>
    <div v-if='!comments'>
      Loading comments...
    </div>
    <div v-else-if='comments.length===0'>
      No comments to show :/
    </div>
    <div v-else v-for='comment in comments' v-bind:key='comment._id'>
    <div class='single-comment'>
      <div class='profile'>{{comment.username[0].toUpperCase()}}</div>
      <p class='username'><b>@{{comment.username}}</b>  {{comment.content}}</p>
      <div class='time'>
      <span >{{getTime(comment.timeUsec).split(',')[0]}}</span><br>
      <span >{{getTime(comment.timeUsec).split(',')[1]}}</span>
      </div>
      <img v-if='user && user._id === comment.userID' v-on:click='deleteComment(comment._id)' class='icon' src="@/assets/delete.png">
    </div>
    </div>
    </div>
     <div v-if='loggedIn' class='comment'>
     <textarea v-model='comment' placeholder="Say something about this blockage"></textarea>
     <button class='comment-button' :disabled='comment.length === 0' v-on:click='submitComment'>Post</button>
     </div>
  </div>
</template>

<script>
import axios from 'axios';

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
         reporterUsername: 'dumpling',
         comments: undefined
      };
   },
   mounted() {
     this.getAllComments();
   },
   methods: {
      submitComment () {
         // axios request to submit comment in this.comment
         // if successful, set this.comment = ''
        let fields = {
          content: this.comment,
        };
        axios.post(`/api/blockages/comments/` + this.blockageData._id, fields).then(() => {
          console.log('posted comment!');
          this.getAllComments();
        }).catch(err => {
          console.log(err.response || err);
          this.errorMessage = err.response.data.error 
            || err.response.data.message 
            || "An unknown error occurred when posting this comment.";
        });
      },
      deleteComment(id) {
        axios.delete('/api/blockages/comments/' + id).then((res) => {
          console.log('successfully deleted comment');
          console.log(res);
          this.getAllComments();
        }).catch(err => {
          console.log(err.response || err);
          this.errorMessage = err.response.data.error 
            || err.response.data.message 
            || "An unknown error occurred when deleting this comment.";
        })
      },
      getAllComments() {
        axios.get('/api/blockages/comments/' + this.blockageData._id).then((res) => {
          console.log('got all comments!');
          this.comments = res.data.filter( comment => comment); // filter out null deleted comments
          console.log(this.comments);
        }).catch(err => {
          console.log(err.response || err);
          this.errorMessage = err.response.data.error 
            || err.response.data.message 
            || "An unknown error occurred when posting this comment.";
        });
      },
      getTime(timeUsec) {
        var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date.setUTCSeconds(timeUsec/1000);
        return date.toLocaleString('en-US');
      }
   }
}
</script>

<style scoped>

.time {
   margin-left: 10px;
   margin-right: -3px;
   margin-bottom: 0px;
   margin-top: 4px;
   width: 100px;
   font-size: 14px;
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
   width: 40px;
   height: 35px;
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
   font-size: 18px;
}

.icon {
  height: 25px;
  width: 25px;
  margin-right: 0px;
  margin-left: 2px;
  cursor: pointer;
}

.comments {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;
}

.comments::-webkit-scrollbar {
  display: none;
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
   resize: none;
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