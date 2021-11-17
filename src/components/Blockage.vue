<template>
    <form action="" class="blockage-creator" @submit.prevent=''>
        <!-- The Error Label if one occurs -->
        <h1>Blockage</h1>
        <!-- <div class="textboxes"> -->
            <span>Date: {{  date  }}</span>
            <span>Time: {{  time  }}</span>
            <div v-if='editing'>
                <h2>Status</h2>
                            <div class="checkboxes">
            <span>
                <input type="radio" id="unblocked" value="Unblocked" v-model="newStatus">
                <label for="unblocked">Unblocked</label>
            </span>
            <span>
                <input type="radio" id="unsafe" value="Unsafe" v-model="newStatus">
                <label for="unsafe">Unsafe</label>
            </span>
            <span>
                <input type="radio" id="blocked" value="Blocked" v-model="newStatus">
                <label for="blocked">Blocked</label>
            </span>
            </div>
                <h2>Details</h2>
                <textarea placeholder="hi" v-model='newDetails'/>
                <button v-on:click="submitEditted">Submit</button>
            </div>
            <div v-else>
                <span>Status: {{  status  }}</span>
                <br>
                <span>Details: {{  details }}</span>
            </div>

            <button :disabled="editing" v-on:click="editBlockage">Edit</button>
            <button v:on-click="deleteBlockage">Delete</button>
    </form>
</template>

<script>
// import axios from 'axios';


export default {
    name: 'CreateBlockage',
    components: {
    },
    data () {
        return {
            errorMessage: '',
            details: 'details here',
            status: 'Unblocked',
            date: "Nov 9 2021",
            time: "9:30:00",
            editing: false,
            newStatus: '',
            newDetails: '',
        }
    },
    mounted() {
        this.newDetails = this.details;
        this.newStatus = this.status;
    },
    emits: [
        // 'created-freet'
    ],
    methods: {
        statusChecked( checked ) {
            this.checkedStatus = checked;
        },
        // onEnter(e) {
        //     if (e.shiftKey) return;
        //     if (this.content.length == 0) return;

        //     e.preventDefault();
        //     this.createFreet();
        //     this.content = '';
        // },
        editBlockage() {
            this.editing = true;
            console.log('hi');
        },
        
        // submit the editted blockage
        submitEditted() {
            // request to submit editted blockage
            this.editing = false;
            // new status: this.newStatus
            // new details: this.newDetails
        },
        /**
         * Makes an API request to create a new Freet. If successful, triggers the callback 
         * for the parent element to update its view as necessary, such as by reloading the
         * list of freets.
         */
        deleteBlockage () {
            // let fields = { content: this.content };
            // axios.post(`/api/freets/`, fields).then(() => {
            //     this.errorMessage = '';
            //     this.$emit('created-freet');
            //     this.content = '';
                
            // }).catch(err => {
            //     console.log(err.response || err);
            //     this.errorMessage = err.response.data.error 
            //                         || err.response.data.message 
            //                         || "An unknown error occurred when posting this Freet.";
            // });
        },

    }
}
</script>

<style scoped>
h1, h2 {
    color: rgb(69, 38, 118);
}

.checkboxes {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* width: 100%; */
}
.blockage-creator {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(186, 186, 235);

    /* height: 100px; */
    /* max-width: 500px; */
    width: 50%;
    border: 2px solid rgb(81, 138, 235);
    border-radius: 15px;
    color: black;
    font-size: 15px;
    margin: 10px auto 10px auto;
    padding: 20px;
    padding-right: 12px;
}

.feed-icon {
 width: 30px;
 margin-right: 10px;
}

textarea {
    width: 70%;
    /* vertical-align: top; */
    resize: none;
    padding: 8px;
    margin: 0 8px 0 8px;
    border-radius: 5px;
    border: none;
}

.textboxes {
    display: flex;
}

.post-button {
    /* vertical-align: top; */
    font-size: 25px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
    border-radius: 10px;
    height: 60%;
    margin-top: 4%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    background-color: rgb(68, 169, 223);
    color: white;
    padding: 10px;
    /* margin-left: 3px; */
}

.post-button:disabled {
    background-color: rgb(148, 148, 148);
    color: rgb(235, 235, 235);
}

.post-button:hover:enabled {
    background-color: rgb(249, 199, 138);
}

.error{
    color: red;
}
</style>
