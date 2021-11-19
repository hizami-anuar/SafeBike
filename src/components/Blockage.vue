<template>
    <form action="" class="blockage-creator" @submit.prevent=''>
        <div class='reporter'>
            <div class='profile'>{{reporterUsername[0].toUpperCase()}}</div>
            <span class='username'>@{{reporterUsername}}</span>
        </div>
        <h1>{{  newStatus.toUpperCase()  }}</h1>
            <span>{{ longitude }}°, {{ latitude }}°</span>
            <span>{{  date  }}</span>
            <div v-if='editing'>
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
                <h2>Description</h2>
                <textarea placeholder="New description here" v-model='newDescription'/>
                <div class='edit-mode-buttons'>
                <button class='cancel-button' v-on:click="cancelEdit">Cancel</button>
                <button class='done-button' v-on:click="submitEditted">Done</button>
                </div>
            </div>
            <div v-else>
                <span class="description" v-if='description.length!==0'>{{  description }}</span>
            </div>
            <div v-if='loggedIn && user.userID === reporterId' class="edit-delete-buttons">
                <!-- <button :disabled="editing" v-on:click="editBlockage"> -->
                    <img v-if="!editing" class='icon' v-on:click="editBlockage" src="@/assets/edit.png"/>
                    <!-- Edit -->
                <!-- </button> -->
                <img v-if="!editing" class='icon' v-on:click="deleteBlockage" src="@/assets/delete.png"/>

                <!-- <button v-on:click="deleteBlockage">Delete</button> -->
            </div>
            
    </form>
</template>

<script>
import axios from 'axios';


export default {
    name: 'Blockage',
    components: {
    },
    props: {
        /** @type {Blockage} The blockage object to display */
        blockageData: Object,
        loggedIn: Boolean,
        user: Object
    },
    data () {
        return {
            errorMessage: '',
            description: this.blockageData.description, 
            status: this.blockageData.status, 
            longitude: this.blockageData.location.coordinates[0].toFixed(2), // round longitude to 2 decimals
            latitude: this.blockageData.location.coordinates[1].toFixed(2), // round latitude to 2 decimals
            editing: false, // whether we're in editing mode or not
            newStatus: '', // updated status for editing mode
            newDescription: '', // updated description for edidting mode
            date: '', // formated time for displaying (human readable) 
            reporterUsername: this.blockageData.reporterUsername,
            reporterId: this.blockageData.reporter,
        }
    },
    mounted() {
        // updated description and status starts off same as current to display initially
        this.newDescription = this.description;
        this.newStatus = this.status;
        // convert from unix epoch time to human readable date
        var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date.setUTCSeconds(this.blockageData.time/1000);
        this.date = date;
    },
    emits: [
        'refresh-blockages',
    ],
    methods: {
        // enter edit blockage mode
        editBlockage() {
            this.editing = true;
        },
        // cancel edit blockage mode
        cancelEdit() {
            this.editing = false;
            this.newStatus = this.status;
        },
        // submit the editted blockage
        submitEditted() {
            this.editing = false; // exit blockage mode

            // updated blockage info: right now can't edit location (to do?)
            let updatedBlockageData = {
                location: {
                    longitude: this.longitude,
                    latitude: this.latitude,
                },
                description: this.newDescription,
                status: this.newStatus
            }

            // request to submit editted blockage
            axios.patch(`/api/blockages/${this.blockageData._id}`, updatedBlockageData)
                .then((response) => {
                    console.log(response);
                    console.log('edited blockage');
                    this.$emit('refresh-blockages');

                    // update the description and status displayed to the new ones
                    this.description = this.newDescription;
                    this.status = this.newStatus;

                    //update the frontend time
                    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    date.setUTCSeconds(Date.now()/1000);
                    this.date = date;
                }).catch((error) => {
                    console.log(error);
                });
        },
        /**
         * Makes an API request to delete blcoakge. If successful, triggers the callback 
         * for the parent element to update its view as necessary, such as by reloading the
         * list of blockages.
         */
        deleteBlockage() {
            console.log('deleting blockage?');
            axios.delete(`/api/blockages/${this.blockageData._id}`)
            .then((response) => {
                console.log(response);
                console.log('deleted blockage');
                this.$emit('refresh-blockages');
            }).catch((error) => {
                console.log(error);
            })
        },
    }
}
</script>

<style scoped>
h1, h2 {
    color: rgb(69, 38, 118);
}
h1 {
    font-size: 20px;
}

.username {
    font-weight: bold;
    font-size: 20px;
}
.reporter {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

.profile {
    background-color: rgb(90, 0, 128);
    border-radius: 30px;
    color: rgb(254, 254, 254);
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    margin-right: 10px;
    font-weight: bold;
}
.icon {
    height: 25px;
    width: 25px;
    margin-right: 10px;
    margin-left: -2px;
    cursor: pointer;
}
button {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    background-color: rgb(208, 252, 255);
    font-size: 17px;
    font-weight: bold;
    color: rgb(94, 36, 133);
    cursor: pointer;
}

button:disabled {
    color: grey;
    background-color: rgb(216, 216, 245);
    cursor: not-allowed;
}

button:hover:enabled {
    background-color: rgb(255, 254, 204);
}

.description {
    font-size: 18px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
}

.edit-delete-buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    margin-right: -20px;
}

.edit-mode-buttons {
    display: flex;
    justify-content: center;
}

.done-button {
    width: 40%;
    margin-top: 10px;
}

.cancel-button {
    width: 40%;
    margin-top: 10px;
    background: none;
    color: rgb(131, 33, 131);
    font-weight: bold;
    border: 3px rgb(171, 93, 216) solid;
}

.checkboxes {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 30%;
}

.blockage-creator {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(186, 186, 235);

    /* height: 100px; */
    /* max-width: 500px; */
    width: 75%;
    border: 3px solid rgb(111, 79, 199);
    border-radius: 15px;
    color: black;
    font-size: 15px;
    margin: 10px auto 10px auto;
    padding: 20px;
    /* padding-right: 12px; */
}

.feed-icon {
 width: 30px;
 margin-right: 10px;
}

textarea {
    width: 90%;
    /* resize: none; */
    padding: 8px;
    margin: 0 8px 0 8px;
    border-radius: 5px;
    border: none;
}

.textboxes {
    display: flex;
}

.post-button {
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
