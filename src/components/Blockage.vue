<template>
    <form action="" class="blockage-creator" @submit.prevent=''>
        <!-- The Error Label if one occurs -->
        <h1>Blockage</h1>
        <!-- <div class="textboxes"> -->
            <span>Time: {{  date  }}</span>
            <span>Location: {{  location  }}</span>
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
                <button v-on:click="submitEditted">Done</button>
                <button v-on:click="cancelEdit">Cancel</button>
            </div>
            <div v-else>
                <span>Status: {{  status  }}</span>
                <br>
                <span>Details: {{  details }}</span>
            </div>

            <button :disabled="editing" v-on:click="editBlockage">Edit</button>
            <button v-on:click="deleteBlockage">Delete</button>
    </form>
</template>

<script>
import axios from 'axios';


export default {
    name: 'Blockage',
    components: {
    },
    props: {
        /** @type {Blockage} A list of freet ids to display */
        blockageData: Object,
    },
    data () {
        return {
            errorMessage: '',
            details: this.blockageData.description,
            status: this.blockageData.status,
            time: this.blockageData.time,
            location: this.blockageData.location.coordinates,
            editing: false,
            newStatus: '',
            newDetails: '',
            id: '',
            date: '',
        }
    },
    mounted() {
        this.newDetails = this.details;
        this.newStatus = this.status;
        var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date.setUTCSeconds(this.time/1000);
        this.date = date;
    },
    computed() {
    },
    emits: [
        // 'created-freet'
        'refresh-blockages',
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
        cancelEdit() {
            this.editing = false;
            console.log('edit canceled');
        },
        // submit the editted blockage
        submitEditted() {
            // request to submit editted blockage
            this.editing = false;
            let updatedBlockageData = {
                location: this.location,
                description: this.newDetails,
                status: this.newStatus
            }

            axios.patch(`/api/blockages/${this.blockageData._id}`, { data: updatedBlockageData })
                .then((response) => {
                    console.log(response);
                    console.log('edited blockage');
                    this.$emit('refresh-blockages');
                    this.details = this.newDetails;
                    this.status = this.newStatus;
                }).catch((error) => {
                    console.log(error);
                });
        },
        /**
         * Makes an API request to create a new Freet. If successful, triggers the callback 
         * for the parent element to update its view as necessary, such as by reloading the
         * list of freets.
         */
        deleteBlockage() {
            console.log('deleting blockage?');
            axios.delete(`/api/blockages/${this.blockageData._id}`)
            .then((response) => {
                console.log(response);
                console.log('deleted');
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
