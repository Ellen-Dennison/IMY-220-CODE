let appName = "PhotoShare";
let totalPhotos = 12;
let isOnline = true;
let friendNames = ["Thandi", "Pieter", "Lerato"];
let likeCounts = [4, 11, 7, 20];
/*
Add explicit type annotations to all five variables.
Write sumLikes(likes) that takes a number array and returns the total. Type the parameter and the return value.
Try totalPhotos = "twelve";. Confirm it is a compile error, add a comment explaining why, then delete the line.
*/
function sumLikes(Likes) {
    return Likes.reduce((sum, like) => sum + like, 0);
}
console.log(sumLikes(likeCounts));
function formatUsername(name) {
    return name.map((x) => "@" + x.toLowerCase());
}
console.log(formatUsername(friendNames));
function logGreeting(name) {
    console.log("Welcome back, " + name);
}
formatUsername(friendNames).forEach(logGreeting);
export {};
