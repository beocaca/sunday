const timeEntry = {
    description: "",
    billable: 0,
    start: null,
    end: null,
    duration: null,
    label_ids: []
};

import { cloneDeep } from "lodash-es";
import { format as formatDate } from "date-fns";
import axios from "axios";
import Duration from "duration";

export default class tracker {
        constructor(trackConfig = {}) {
            this.timeEntry = Object.assign(timeEntry, trackConfig)
            this.running= false
            this.now= null
            this.onUpdate = null
            this.interval = null
        }
        startTimer() {
            const formData = cloneDeep(this.timeEntry);

            formData.start = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
            formData.label_ids = JSON.stringify(timeEntry.label_ids);

            axios
            .post("/time-entries", formData)
            .then(({ data }) => {
                this.running = true;
                this.timeEntry = data;
            })
            .catch(error => {
                this.$notify({
                title: "Error",
                message: error.response.data.status.message,
                type: "error"
                });
            });
        }

        prepareForm() {
            const formData = cloneDeep(this.timeEntry);
            formData.start = formatDate(this.timeEntry.start, "yyyy-MM-dd HH:mm:ss");
            formData.label_ids = JSON.stringify(this.timeEntry.label_ids);
            return formData;
        }

        updateEntry(formData) {
            formData = formData || this.prepareForm();
            return axios.put(`/time-entries/${this.timeEntry.id}`, formData);
        }

        setCurrentTimer(data) {
            if (data && data.length) {
                const timeEntry = data[0];
                this.running = true;
                this.timeEntry = timeEntry;
            }
        }

        stopTimer() {
            const formData = cloneDeep(this.timeEntry);
            formData.end = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
            formData.start = formatDate(new Date(this.timeEntry.start), "yyyy-MM-dd HH:mm:ss");
            formData.label_ids = JSON.stringify(this.timeEntry.label_ids);
            formData.status = 1;
            this.updateEntry(formData).then(() => {
                this.running = false;
                clearInterval(this.interval)
            this.resetTimer();
            this.$emit("stopped");
            });
        }

        resetTimer() {
            this.timeEntry = cloneDeep(timeEntry);
        }

        toggleTimer() {
            this.running ? this.stopTimer() : this.startTimer();
        }

        trackTime() {
            this.interval = setInterval(() => {
                this.now = new Date();
                this.timeEntry.duration = this.getDuration()
            }, 1000);
        }

        getDuration() {
            let duration = 0;
            if (this.timeEntry.start) {
              const start = formatDate(new Date(this.timeEntry.start), "yyyy-MM-dd HH:mm:ss");
              duration = new Duration(new Date(start), this.now);
              return duration.toString("%H:%M:%S");
            }

            return "00:00:00";
        }

        focusTagSelect(event) {
            if (event.relatedTarget) {
            this.$refs.tagSelect.click();
            }
        }
}
