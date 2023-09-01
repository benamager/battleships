Intro

Remember playing battleships as a child? Yeah, me too. It was fun!

I remember an old app for the iPhone 4 time, which let me and by dad play it against each other over bluetooth or wifi, and I kinda miss that. So here I am... a frontend developer trying to go full-stack.



### Start

I want to make it as a website. One user goes to it, creates a joinable link where another user then can join it, and play. Pretty straight forward.

Lets start by covering the basics.

- **How does the battleship game even works:** You might already know it, but.. here it is. The game has two grids of 10x10 one for each player. They secretly place their ships, where the ships is a predefined set of various sizes. Players then take turns on each other to guess one grid square. If they hit, they continue, if they miss, it becomes opponents turn. Battleships cant overlap and has a margin of 1 grid square on all sites.
- **Then we'll need a frontend:** This is all that the user sees and interacts with. This would be the game itself, interface to create that game, edit their grid of ships and yeah before it, basically everything you see on the website. But how would we make players connect toghether? You guessed it.
- **A backend:** This will be a server, which is basically just a computer with no GUI running other programs than yours. It will have three primary functions. First it will have a database which saves a list of all joinable games. This is to know when joining the URL that theres actually a game active. Then we'll need live connection between the two players - here imma use websockets. Normally stuff on the web happens via HTTPS, which does support live. Also it will handle game logic.



What I'll do now is start by building the fundamentals.
