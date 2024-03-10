// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com

import {renderTask} from "../../utils.js";

render();

function render() {
    // noinspection JSUnresolvedVariable
    chrome.storage.sync.get(["tasks"], (data) => {
        let taskStats = document.getElementById("task-stats");

        for (const [taskName, taskData] of Object.entries(data.tasks)) {
            taskStats.append(renderTask(taskName, taskData));
        }
        document.body.style.height = document.body.scrollHeight + 10 + "px";
    })

}
