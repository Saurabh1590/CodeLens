 "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = exports.Verdict = exports.SnapshotTrigger = exports.SessionStatus = exports.Difficulty = exports.EventType = void 0;
// Enums
var EventType;
(function (EventType) {
    EventType["OPEN_PROBLEM"] = "OPEN_PROBLEM";
    EventType["START_TYPING"] = "START_TYPING";
    EventType["RUN"] = "RUN";
    EventType["SUBMIT"] = "SUBMIT";
    EventType["WRONG_ANSWER"] = "WRONG_ANSWER";
    EventType["TLE"] = "TLE";
    EventType["RUNTIME_ERROR"] = "RUNTIME_ERROR";
    EventType["COMPILE_ERROR"] = "COMPILE_ERROR";
    EventType["ACCEPTED"] = "ACCEPTED";
    EventType["LEAVE_PAGE"] = "LEAVE_PAGE";
})(EventType || (exports.EventType = EventType = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["SOLVED"] = "SOLVED";
    SessionStatus["UNSOLVED"] = "UNSOLVED";
    SessionStatus["ABANDONED"] = "ABANDONED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
var SnapshotTrigger;
(function (SnapshotTrigger) {
    SnapshotTrigger["RUN"] = "RUN";
    SnapshotTrigger["SUBMIT"] = "SUBMIT";
})(SnapshotTrigger || (exports.SnapshotTrigger = SnapshotTrigger = {}));
var Verdict;
(function (Verdict) {
    Verdict["ACCEPTED"] = "ACCEPTED";
    Verdict["WRONG_ANSWER"] = "WRONG_ANSWER";
    Verdict["TLE"] = "TLE";
    Verdict["RUNTIME_ERROR"] = "RUNTIME_ERROR";
    Verdict["COMPILE_ERROR"] = "COMPILE_ERROR";
})(Verdict || (exports.Verdict = Verdict = {}));
var Platform;
(function (Platform) {
    Platform["LEETCODE"] = "LEETCODE";
    Platform["GEEKSFORGEEKS"] = "GEEKSFORGEEKS";
    Platform["CODEFORCES"] = "CODEFORCES";
    Platform["HACKERRANK"] = "HACKERRANK";
    Platform["CODECHEF"] = "CODECHEF";
})(Platform || (exports.Platform = Platform = {}));  // Enums
