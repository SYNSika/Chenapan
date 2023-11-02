# Chenapan online

In the project, I am developping a VUEjs single page application with a NodeJs Backend to game the game Chenapan with remote player.

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

![victory_cases](https://github.com/SYNSika/Chenapan/assets/97160902/6740316f-4d3e-4156-8d92-bec6a7c96e25)

------------------------------------

### Pieces moves

#### Default move
the pieces 2 to 9 pieces can move in a cross direction. The higher value piece will move the lower value piece.

![default_move](https://github.com/SYNSika/Chenapan/assets/97160902/47570e8a-7cca-4e82-b059-748cc7b214b1)

#### Figures move
The figures are the only pieces that cannot move the 0 piece

the Jack (V) will move similarily to the knight in chess. 

![V_moves](https://github.com/SYNSika/Chenapan/assets/97160902/c18c727d-e9cb-4a3c-854b-9d2a01aad0ca)

the Queen (D) will move in a cross shape but two spaces in front of her.

![D_moves](https://github.com/SYNSika/Chenapan/assets/97160902/5e803a7c-cb8c-4fb0-952b-a004867995ab)

the King (R) will move to the space around him. But he cannot move the As (A).

![R_moves](https://github.com/SYNSika/Chenapan/assets/97160902/35031d38-161a-4004-88a1-88c619325a5f)

the As (A) have the same move pattern as the King (R) but is the weakest against all of the pieces except the King (R).

![A_moves](https://github.com/SYNSika/Chenapan/assets/97160902/3d0f0010-672a-4885-a919-d32e1f600a6a)

