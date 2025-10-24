# Same Game

What started as a joke became a little obsession.

[Play](https://same-game.orjan.be/)

## Why I made this

I wanted to surprise my colleagues with a continuation of an ongoing inner joke where the image of one of my colleagues was planted onto a Pokemon.
The new idea was to create a little game with those characters and share it with the team when I was about to leave the company.
My mind was racing with ideas: use different colors, give the different characters their signature moves, add options, add a recorder to replay the last game, add a literal extra dimension ...
Not all these ideas came to be (yet).

Most of all, I wanted it to be fun!

## How I made this game

The first question to ask was

> Which game could I make? 
> It should have simple rules and easy to implement.

When I was still in university, one of the students had an old-school PDA, the type where a stylus was advised to interact with the small elements on the pixelated screen.
But it sported the Same Game in all of 4 colors.
I remember it being such fun to play this during classes.
It easily beat the runner-up, the Bejeweled clone.

As I couldn't remember the stupid name of this game, I send a query to ChatGPT to find out what this game was called.
Additionally I needed to know what the rules are and how the score is calculated. 
Once I had this information, I tried to implement this game.

The first version was a single JavaScript file that logged to console.
I kept switching between a two-dimensional array representing the rows and columns and a one-dimensional array with an object that had its coordinates as properties.
Each representation had its advantages and disadvantages, but I ultimately decided on a two-dimensional array with a function to cpnvert it to a one-dimensional array.

While working through the function for removing cells from the grid, I finally found an easier way to filter out the removed cells.
The solution was to switch the two-dimensional array from row-column dimensions to dimension-row dimensions.
This lead to the end of the first phase, the game engine.

The next step was to work on the presentation.
I wanted to use a light-weight JS library like [Phaser](https://phaser.io/), [LittleJS](https://killedbyapixel.github.io/LittleJS/) or [ExcaliburJS](https://excaliburjs.com/).
I eventually decided on [React](https://react.dev/), with [Vite](https://vite.dev) as the build tool because of the familiarity and for a joke project I didn't want to spend the extra time learning a new framework on top of how to animate this.

I sank more time into this than expected.
During work breaks, I stayed at my computer to work on this little game.
The time I was afk, I clumsily fiddled with CSS animations on my phone.
In the meantime I worked out ideas to improve on this game and to give it a special twist.
These eventually got implemented into the project or at least became an issue on the GitHub project.

## Disclaimer

Pokémon, the Pokémon logo, and the names of all Pokémon characters are trademarks of Nintendo, The Pokémon Company, and/or Game Freak.
All rights reserved.
I am not, in any way, affiliated by these companies.
