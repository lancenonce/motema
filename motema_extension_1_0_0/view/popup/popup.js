import {calculateRph, renderTask, REFRESH_REQUIRED_REQUEST, sendRefreshRequiredRequest} from "../../utils.js";

let isDetached;
isDetachedWindow();
renderDetachedPopupHelp();
render();
addButtonFunctions();
handleRefreshRequiredRequest();
refreshEverySeconds();

const DETACHED_POPUP_WINDOW_HEIGHT = 510;
const DETACHED_POPUP_WINDOW_WIDTH = 200;


function render() {

    // noinspection JSUnresolvedVariable
    chrome.storage.sync.get(null, (data) => {
        let currentWorkedSeconds = data.workedSeconds;

        if (data.isCounting) {
            let currentTime = new Date().getTime();
            currentWorkedSeconds = currentWorkedSeconds + (currentTime - data.startTime) / 1000;
        }

        renderCountingStatus(data.isCounting);
        renderWorkedTime(currentWorkedSeconds);
        renderMoneyEarned(currentWorkedSeconds, data.settings);
        renderTaskCount(data.taskCount);
        renderRph(currentWorkedSeconds, data.taskCount);
        renderCurrentTask(data.currentTaskName, data.tasks[data.currentTaskName]);
        resizeIfDetached();
        console.log(data)

        function renderCountingStatus(isCounting) {
            let countingStatusDom = document.getElementById("counting-status");

            if (isCounting) {
                // noinspection JSValidateTypes
                countingStatusDom.innerHTML = "<span style='color:#006400;font-weight:bold'>Counting</span>";

            } else {
                countingStatusDom.innerHTML = "<span style='color:#FF0000;font-weight:bold'>Not counting</span>";
            }

        }

        function renderWorkedTime(currentWorkedSeconds) {

            let workedTimeDom = document.getElementById("worked-time");
            //workedTimeDom.innerHTML = new Date(currentWorkedSeconds * 1000).toISOString().substr(11, 5);
            workedTimeDom = new Date(currentWorkedSeconds * 1000).toISOString().substr(11, 5);
        }

        function renderMoneyEarned(currentWorkedSeconds, settings) {
            if (settings.moneyEarned.payrate !== 0 && settings.moneyEarned.conversionRate !== null) {
                let workedHours = currentWorkedSeconds / 3600;
                let moneyEarned = workedHours * settings.moneyEarned.payrate * settings.moneyEarned.conversionRate;
                let moneyEarnedDom = document.getElementById("money-earned");

                moneyEarnedDom.innerHTML = `${moneyEarned.toFixed(2)} ${settings.moneyEarned.currency}`;
            }
        }

        function renderTaskCount(taskCount) {
            let taskCounter = document.getElementById("task-count");
            taskCounter.innerHTML = taskCount;

        }

        function renderRph(workedSeconds, taskCount) {
            let rphDom = document.getElementById("rph");
            let rph = calculateRph(workedSeconds, taskCount);
            //rphDom.innerHTML = `${rph} seconds`;
            rphDom = `${rph} seconds`;
        }

        function renderCurrentTask(currentTaskName, currentTask) {
            let dCurrentTask = document.getElementById("current-task");
            let dRenderedCurrentTask;

            if (currentTaskName === null) {
                let dNoTaskSolved = document.createElement("p");
                dNoTaskSolved.setAttribute("class", "font-bold mb-10");
                dNoTaskSolved.innerHTML = "No Task Solved";

                dRenderedCurrentTask = document.createElement("div");
                dRenderedCurrentTask.append(dNoTaskSolved);
                dRenderedCurrentTask.append(document.createElement("hr"));

            } else {
                dRenderedCurrentTask = renderTask(currentTaskName, currentTask);
            }

            dRenderedCurrentTask.setAttribute("id", "current-task");
            dCurrentTask.replaceWith(dRenderedCurrentTask);
        }

    })


    function resizeIfDetached() {
        if (isDetached) {
            // noinspection JSUnresolvedVariable,DuplicatedCode,JSUnresolvedFunction
            chrome.windows.getCurrent((window) => {
                let exceptedHeight = document.body.scrollHeight + 25;
                if (window.height !== exceptedHeight) {
                    // noinspection JSUnresolvedVariable
                    chrome.windows.update(window.id, {height: document.body.scrollHeight + 25});
                }
                if (window.width !== DETACHED_POPUP_WINDOW_WIDTH) {
                    // noinspection JSUnresolvedVariable
                    chrome.windows.update(window.id, {width: DETACHED_POPUP_WINDOW_WIDTH});
                }
            })

        }
    }

}


function addButtonFunctions() {
    handleStart();
    handleStop();
    handleReset();
    handleDetach();

    function handleStart() {
        let submitButton = document.getElementById("start-btn");

        submitButton.addEventListener("click", function () {
            console.log("start clicked")
            // noinspection JSUnresolvedVariable
            chrome.storage.sync.get(["isCounting"], function (isCounting) {
                    if (!isCounting.isCounting) {
                        let startTime = new Date().getTime();
                        // noinspection JSUnresolvedVariable
                        chrome.storage.sync.set({
                            "startTime": startTime,
                            "isCounting": true,
                            "lastSubmit": startTime
                        })
                        console.log("Timer started");
                        // noinspection JSValidateTypes
                        render();
                        sendRefreshRequiredRequest();
                    }
                }
            )

        })

    }

    function handleStop() {
        let stopButton = document.getElementById("stop-btn");

        stopButton.addEventListener("click", () => {
            // noinspection JSUnresolvedVariable
            chrome.storage.sync.get(["stopTIme", "startTime", "workedSeconds", "isCounting"], function (data) {
                if (data.isCounting) {
                    let stopTime = new Date().getTime();
                    // eslint-disable-next-line no-undef
                    // noinspection JSUnresolvedVariable
                    chrome.storage.sync.set({
                        "workedSeconds": data.workedSeconds + (stopTime - data.startTime) / 1000,
                        "stopTime": stopTime,
                        "isCounting": false
                    });
                    render();
                    sendRefreshRequiredRequest();
                    clearInterval();
                }
                console.log("Timer stopped");
            })

        })
    }


    function handleReset() {
        let resetButton = document.getElementById("reset-btn");
        resetButton.addEventListener("click", () => {
            // noinspection JSUnresolvedVariable
            chrome.storage.sync.set({
                "taskCount": 0,
                "startTime": 0,
                "stopTime": 0,
                "workedSeconds": 0,
                "isCounting": false,
                "currentTaskName": null,
                "tasks": {},
                "lastSubmit": null,
            });
            render();
            sendRefreshRequiredRequest();
            clearInterval();
        })

    }

    function handleDetach() {
        let dDetachBtn = document.getElementById("detach-icon");

        dDetachBtn.addEventListener("click", () => {
            // noinspection JSUnresolvedVariable
            chrome.windows.create({
                url: "view/popup/popup.html",
                type: "popup",
                width: DETACHED_POPUP_WINDOW_WIDTH,
                height: DETACHED_POPUP_WINDOW_HEIGHT,

            });

        })
    }

}

function handleRefreshRequiredRequest() {
    // noinspection JSUnresolvedVariable,JSDeprecatedSymbols
    chrome.runtime.onMessage.addListener((request) => {
            if (request.msg === REFRESH_REQUIRED_REQUEST) {
                render();

            }
        }
    )
}

function renderDetachedPopupHelp() {
    // noinspection JSUnresolvedVariable,JSUnresolvedFunction
    chrome.windows.getCurrent((window) => {
        try {
            console.log(window);

            if (isDetached) {
                let dDetachHelpDiv = document.getElementById("detached-help");
                let dDetachedHelp = document.createElement("h3");

                dDetachedHelp.setAttribute("class", "font-bold");
                dDetachedHelp.innerHTML = 'Right click on this tab header and select "Always on top"';
                dDetachHelpDiv.append(dDetachedHelp);

                setTimeout(() => {
                    dDetachHelpDiv.innerHTML = "";
                    render();

                }, 10000);
            }
        } catch (ignore) {

        }

    })

}

function refreshEverySeconds() {
    let oneSeconds = 1000;
    window.setInterval(render, oneSeconds);

}

function isDetachedWindow() {
    try {
        // noinspection JSUnresolvedVariable,JSUnresolvedFunction
        chrome.windows.getCurrent((window) => {
            isDetached = window.height === DETACHED_POPUP_WINDOW_HEIGHT;
        })

    } catch (ignore) {

    }

}
