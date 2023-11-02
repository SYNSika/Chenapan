# Chenapan online

In the project, I am 

## Running backend

```sh
$ cd client
$ npm i 
$ npm run serve
```

## Running Front end

```sh
$ cd server
$ npm i
$ npm start

```
### Rules of the game

The goal of the game is to place the 0 to the the last row of the opponent side.

You can do that by swapping the pieces between themselves. Depending on the pieces' values, their moves will differ from the others.

### Pieces moves

#### Default move
the pieces 2 to 9 pieces can move in a cross direction. The higher value piece will move the lower value piece.

#### Figures move
The figures are the only pieces that cannot move the 0 piece

the Jack (V) will move similarily to the knight in chess. 

the Queen (D) will move in a cross shape but two spaces in front of her.

the King (R) will move to the space around him. But he cannot move the As (A).

the As (A) have the same move pattern as the King (R) but is the weakest against all of the pieces except the King (R).


