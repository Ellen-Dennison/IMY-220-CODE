let appName: string = "PhotoShare";
let totalPhotos: number = 12;
let isOnline: boolean = true;
let friendNames: string[] = ["Thandi", "Pieter", "Lerato"];
let likeCounts : number[] = [4, 11, 7, 20];

function sumLikes(Likes : number[]): number {
    return Likes.reduce((sum, like) => sum + like, 0)
}
console.log(sumLikes(likeCounts));

function formatUsername(name : string[]): string[] {
    return name.map((x) => "@" + x.toLowerCase())
}
console.log(formatUsername(friendNames));

function logGreeting(name : string): void{
    console.log("Welcome back, " + name);
}
formatUsername(friendNames).forEach(logGreeting);

const photo: { id: number, url: string, likes: number, caption?: string } =
{
    id: 0,
    url: "",
    likes: 0
}

/* 
Create an object type for a photo with these properties:
id (number)
url (string)
likes (number)
caption (string, optional)
Create an array feedPhotos of at least 4 photos. At least two must have no caption.
Write describePhoto(photo) that returns a string like:
Photo 3 (7 likes): Sunset at the beach
When there is no caption, use the fallback "(no caption)". You must use the ?? operator.
Loop over feedPhotos and log each description.

*/

export {};